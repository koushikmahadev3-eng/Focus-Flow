'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { Play, Pause, Scan, EyeOff, CheckCircle2, Maximize2 } from 'lucide-react';

const SPONSORS = [
    { name: 'Physics Wala', text: 'Master Mode Active', color: '#1A1D21', textCol: '#D90429' },
    { name: 'Academic', text: 'Telemetry Online', color: '#1A1D21', textCol: '#D90429' }
];

interface StudySessionProps {
    initialDuration: number; // in minutes
    isCommuteMode: boolean;
}

export default function StudySession({ initialDuration = 25, isCommuteMode = false }: StudySessionProps) {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(initialDuration * 60);
    const [points, setPoints] = useState(0);
    const [model, setModel] = useState<any>(null);
    const [isFaceDetected, setIsFaceDetected] = useState(true);
    const [isTabActive, setIsTabActive] = useState(true);
    const [permissionRequested, setPermissionRequested] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const timerRef = useRef<NodeJS.Timeout>(null);
    const [modelError, setModelError] = useState(false);

    // --- Audio Engine ---
    const [currentSound, setCurrentSound] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const oscillatorRef = useRef<any>(null); // For Synth
    const gainNodeRef = useRef<any>(null);
    const audioCtxRef = useRef<any>(null);

    const SOUNDS = [
        { id: 'rain', name: 'Rain', type: 'file', src: '/sounds/rain.ogg' },
        { id: 'forest', name: 'Forest', type: 'file', src: '/sounds/forest.ogg' },
        { id: 'cafe', name: 'Cafe', type: 'file', src: '/sounds/cafe.ogg' },
        { id: 'fire', name: 'Fire', type: 'file', src: '/sounds/fire.ogg' },
        { id: 'night', name: 'Night', type: 'file', src: '/sounds/night.ogg' },
        { id: 'white', name: 'White', type: 'synth', color: 'white' },
        { id: 'pink', name: 'Pink', type: 'synth', color: 'pink' },
        { id: 'brown', name: 'Brown', type: 'synth', color: 'brown' },
        { id: 'alpha', name: 'Alpha', type: 'binaural', freq: 10 },
        { id: 'theta', name: 'Theta', type: 'binaural', freq: 6 },
    ];

    const stopAudio = () => {
        // Stop File
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        // Stop Synth
        if (oscillatorRef.current) {
            try { oscillatorRef.current.stop(); } catch (e) { }
            try { oscillatorRef.current.disconnect(); } catch (e) { }
            oscillatorRef.current = null;
        }
    };

    const playSynth = (type: string, param: any) => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.05; // Low volume for synth
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;

        if (type === 'synth') {
            const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);

            let lastOut = 0;

            for (let i = 0; i < bufferSize; i++) {
                if (param === 'white') {
                    data[i] = Math.random() * 2 - 1;
                } else if (param === 'pink') {
                    const white = Math.random() * 2 - 1;
                    data[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = data[i];
                    data[i] *= 3.5;
                } else {
                    const white = Math.random() * 2 - 1;
                    data[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = data[i];
                    data[i] *= 3.5;
                }
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            noise.connect(gainNode);
            noise.start();
            oscillatorRef.current = noise;

        } else if (type === 'binaural') {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(432, ctx.currentTime);

            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(param, ctx.currentTime);

            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 0.5;
            lfo.connect(lfoGain.gain);

            osc.connect(gainNode);
            osc.start();
            lfo.start();
            oscillatorRef.current = osc;
        }
    };

    const toggleSound = (soundId: string) => {
        stopAudio();
        if (currentSound === soundId) {
            setCurrentSound(null);
        } else {
            setCurrentSound(soundId);
            const sound = SOUNDS.find(s => s.id === soundId);
            if (sound) {
                if (sound.type === 'file') {
                    if (audioRef.current) {
                        audioRef.current.src = sound.src || '';
                        audioRef.current.play().catch(e => console.error("Play error", e));
                    }
                } else {
                    playSynth(sound.type, sound.color || sound.freq);
                }
            }
        }
    };

    // Persistence
    useEffect(() => {
        const savedPoints = localStorage.getItem('userParams_points');
        if (savedPoints) setPoints(parseInt(savedPoints));
    }, []);

    useEffect(() => {
        localStorage.setItem('userParams_points', points.toString());
    }, [points]);

    // Load AI Model
    useEffect(() => {
        const loadModel = async () => {
            try {
                await tf.ready();
                const loadedModel = await blazeface.load();
                setModel(loadedModel);
            } catch (err) {
                console.error("Failed to load model", err);
                setModelError(true);
            }
        };
        loadModel();
    }, []);

    // Face Detection Loop
    const checkFace = useCallback(async () => {
        if (!model || !webcamRef.current || !webcamRef.current.video) return;

        if (webcamRef.current.video.readyState !== 4) return;

        if (isActive && !permissionRequested) {
            const returnTensors = false;
            try {
                const predictions = await model.estimateFaces(webcamRef.current.video, returnTensors);
                setIsFaceDetected(predictions.length > 0);
            } catch (err) {
                console.warn("Face detection error", err);
            }
        }
    }, [model, isActive, permissionRequested]);

    useEffect(() => {
        const interval = setInterval(checkFace, 2000);
        return () => clearInterval(interval);
    }, [checkFace]);

    // Tab Visibility
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabActive(document.visibilityState === 'visible');
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Timer Logic
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = 0.5;

        if (isActive && isFaceDetected && isTabActive) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));

                const pointInterval = isCommuteMode ? 20 : 30;
                if (timeLeft % pointInterval === 0 && timeLeft > 0) {
                    setPoints(p => p + 1);
                }
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isActive, isFaceDetected, isTabActive, isCommuteMode, timeLeft]);


    // Visual Math
    const radius = 120;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - ((timeLeft / (initialDuration * 60)) * circumference);
    const modelLoaded = !!model;

    return (
        <div className="w-full h-full flex flex-col items-center relative py-6">
            <audio ref={audioRef} loop />

            {/* Top Bar: System Status & AI with Separation */}
            <div className="w-full flex justify-between items-center px-4 mb-6 border-b border-white/5 pb-2">
                <div className="text-[10px] uppercase tracking-widest text-[var(--accent-acid)] animate-pulse">
                    {isActive ? '● SYSTEM ENGAGED' : '○ STANDBY'}
                </div>
                <div className="text-[10px] font-mono text-[var(--text-secondary)]">
                    AI_MONITORING: {modelLoaded ? 'ACTIVE' : 'INITIALIZING'}
                </div>
            </div>

            {/* AUDIO DECK: Dedicated Center Control Strip (No Overlap) */}
            <div className="w-full max-w-lg mb-8 px-4 flex flex-col items-center">
                <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest mb-3">Audio Focus Environment</div>
                <div className="flex flex-wrap justify-center gap-2">
                    {SOUNDS.map(sound => (
                        <button
                            key={sound.id}
                            onClick={() => toggleSound(sound.id)}
                            className={`
                                text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-sm border transition-all duration-200
                                ${currentSound === sound.id
                                    ? 'bg-[var(--accent-acid)] text-white border-[var(--accent-acid)] shadow-[0_0_15px_rgba(227,0,15,0.4)] scale-105'
                                    : 'bg-black/40 border-[var(--text-secondary)] text-[var(--text-secondary)] hover:border-white hover:text-white hover:bg-white/10'}
                            `}
                        >
                            {sound.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Tachometer Display */}
            <div className="relative flex-1 flex items-center justify-center min-h-[300px] mb-8">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border border-[var(--text-secondary)] opacity-20 scale-110"></div>

                <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg] transition-all duration-500">
                    {/* Track */}
                    <circle
                        stroke="rgba(255,255,255,0.1)"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Indicator */}
                    <circle
                        stroke="var(--accent-acid)"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>

                {/* Center Digital Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-black font-mono tracking-tighter text-white tabular-nums drop-shadow-[0_0_20px_rgba(227,0,15,0.6)]">
                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{Math.floor(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-[10px] tracking-[0.4em] text-[var(--accent-acid)] mt-2 uppercase font-bold">
                        {isCommuteMode ? 'SPORT+' : 'REDLINE'}
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex gap-12 mb-8 text-center">
                <div>
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">Session XP</div>
                    <div className="text-2xl font-mono text-white">{points}</div>
                </div>
                <div>
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">Status</div>
                    <div className={`text-2xl font-mono ${isFaceDetected ? 'text-[var(--accent-acid)]' : 'text-[var(--accent-alert)]'}`}>
                        {isFaceDetected ? 'LOCKED' : 'LOST'}
                    </div>
                </div>
            </div>

            {/* Active Webcam (PiP Mode) - RESTORED & VISIBLE */}
            <div className={`absolute bottom-6 right-6 w-48 h-36 transition-all duration-500 border border-[var(--accent-acid)] rounded-sm overflow-hidden bg-black shadow-[0_0_20px_rgba(227,0,15,0.2)] hover:scale-105 hover:shadow-[0_0_30px_rgba(227,0,15,0.4)] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 grayscale'}`}>
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-acid)] animate-pulse"></div>
                    <span className="text-[8px] font-mono text-white/80 tracking-widest">REC</span>
                </div>
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Controls */}
            <div className="mt-auto flex gap-4 w-full max-w-sm z-10 pb-4">
                {!isActive ? (
                    <button
                        onClick={() => setIsActive(true)}
                        className="btn-porsche btn-primary w-full shadow-[0_0_30px_rgba(227,0,15,0.4)] bg-[var(--accent-acid)] text-white border-0 hover:bg-white hover:text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
                    >
                        <Play size={18} /> INITIATE SPORT MODE
                    </button>
                ) : (
                    <button
                        onClick={() => setIsActive(false)}
                        className="btn-porsche btn-secondary w-full hover:bg-[var(--accent-alert)] hover:border-[var(--accent-alert)]"
                    >
                        <Pause size={18} /> PIGMENT STOP
                    </button>
                )}
            </div>

            {/* Warning Overlays */}
            {isActive && (!isFaceDetected || !isTabActive) && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-6 rounded-sm border border-[var(--accent-alert)]">
                    <Scan size={48} className="text-[var(--accent-alert)] animate-pulse mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">Telemetry Lost</h2>
                    <p className="text-[var(--text-secondary)] font-mono text-xs">
                        {!isFaceDetected ? 'OPTICAL SENSORS CANNOT DETECT PILOT' : 'PILOT FOCUS DIVERTED (TAB SWITCH)'}
                    </p>
                    <p className="mt-8 text-[var(--accent-alert)] animate-pulse font-bold tracking-widest text-sm">RESUME ATTENTION IMMEDIATELY</p>
                </div>
            )}

        </div>
    );
}
