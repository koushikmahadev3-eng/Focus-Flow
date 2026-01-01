'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { Timer, Eye, EyeOff, AlertTriangle, Play, Pause, Scan, CheckCircle2 } from 'lucide-react';

const SPONSORS = [
    { name: 'Physics Wala', text: 'Master concepts with India\'s best teachers!', color: '#eef2ff', textCol: '#4338ca' }, // Indigo-ish
    { name: 'Academic', text: 'Your learning journey starts here.', color: '#f0fdfa', textCol: '#0f766e' }   // Teal-ish
];

interface StudySessionProps {
    initialDuration: number; // in minutes
    isCommuteMode: boolean;
}

export default function StudySession({ initialDuration = 25, isCommuteMode = false }: StudySessionProps) {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(initialDuration * 60);
    const [points, setPoints] = useState(0);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [model, setModel] = useState<any>(null);
    const [isFaceDetected, setIsFaceDetected] = useState(true);
    const [isTabActive, setIsTabActive] = useState(true);
    const [permissionRequested, setPermissionRequested] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const timerRef = useRef<NodeJS.Timeout>(null);
    const adIntervalRef = useRef<NodeJS.Timeout>(null);
    const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);

    // Persistence: Load initial points
    useEffect(() => {
        const savedPoints = localStorage.getItem('userParams_points');
        if (savedPoints) setPoints(parseInt(savedPoints));
    }, []);

    // Persistence: Save points on change
    useEffect(() => {
        localStorage.setItem('userParams_points', points.toString());
    }, [points]);

    useEffect(() => {
        const loadModel = async () => {
            await tf.ready();
            const loadedModel = await blazeface.load();
            setModel(loadedModel);
        };
        loadModel();
    }, []);

    const checkFace = useCallback(async () => {
        if (!model || !webcamRef.current || !webcamRef.current.video) return;
        if (isActive && !permissionRequested) {
            const returnTensors = false;
            const predictions = await model.estimateFaces(webcamRef.current.video, returnTensors);
            setIsFaceDetected(predictions.length > 0);
        }
    }, [model, isActive, permissionRequested]);

    useEffect(() => {
        const interval = setInterval(checkFace, 2000);
        return () => clearInterval(interval);
    }, [checkFace]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabActive(document.visibilityState === 'visible');
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useEffect(() => {
        if (isActive && isFaceDetected && isTabActive) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
                setSessionDuration(prev => {
                    const newDuration = prev + 1;
                    // Base: 2 pts/min (every 30s = 1pt). Commute: 3 pts/min (1.5x).
                    const pointInterval = isCommuteMode ? 20 : 30;
                    if (newDuration % pointInterval === 0) setPoints(p => p + 1);
                    return newDuration;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isActive, isFaceDetected, isTabActive]);

    useEffect(() => {
        adIntervalRef.current = setInterval(() => {
            setCurrentSponsorIndex(prev => (prev + 1) % SPONSORS.length);
        }, 60000);
        return () => { if (adIntervalRef.current) clearInterval(adIntervalRef.current); };
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const currentSponsor = SPONSORS[currentSponsorIndex];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT: Main Focus Area */}
            <div className="lg:col-span-8 space-y-6">

                {/* Header Card */}
                <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                            {isActive ? '🎯 Deep Focus' : '☕ Ready to Study?'}
                        </h2>
                        <p className="text-gray-500 mt-1 font-medium">Keep your camera on to update your stats.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-5xl font-black text-indigo-600 tracking-tight">{formatTime(timeLeft)}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Timer</div>
                    </div>
                </div>

                {/* Webcam / Status Area */}
                <div className="bg-gray-900 rounded-[30px] overflow-hidden relative aspect-video shadow-2xl ring-4 ring-gray-100">
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        className="w-full h-full object-cover opacity-80"
                    />

                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        {!isActive && (
                            <button
                                onClick={() => setIsActive(true)}
                                className="bg-white text-indigo-600 hover:scale-110 transition-transform rounded-full p-8 shadow-2xl flex flex-col items-center gap-2 group"
                            >
                                <Play className="w-12 h-12 fill-current" />
                                <span className="font-bold text-sm tracking-wider uppercase">Start</span>
                            </button>
                        )}

                        {/* Warnings */}
                        {isActive && !isFaceDetected && (
                            <div className="bg-red-500 text-white px-6 py-4 rounded-2xl flex items-center gap-3 animate-bounce shadow-lg">
                                <Scan className="w-6 h-6" />
                                <span className="font-bold">Face Not Detected! Paused.</span>
                            </div>
                        )}
                        {isActive && !isTabActive && !permissionRequested && (
                            <div className="bg-yellow-500 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg">
                                <EyeOff className="w-6 h-6" />
                                <span className="font-bold">Come back to this tab!</span>
                            </div>
                        )}
                    </div>

                    {/* Status Badge */}
                    {isActive && (
                        <div className="absolute top-6 right-6 bg-black/50 backdrop-blur text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            LIVE MONITORING
                        </div>
                    )}
                </div>

            </div>

            {/* RIGHT: Sidebar */}
            <div className="lg:col-span-4 space-y-6">

                {/* Points Card */}
                <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Total Points</h3>
                    <div className="text-6xl font-black text-gray-900 mb-2">{points}</div>
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" /> {isCommuteMode ? '⚡ Commute Boost (1.5x)' : 'Earning Active'}
                    </div>
                </div>

                {/* Ad Card */}
                <div
                    className="rounded-[30px] p-8 text-center transition-colors duration-500"
                    style={{ backgroundColor: currentSponsor.color }}
                >
                    <span className="bg-white/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4 inline-block">Sponsor</span>
                    <h3 className="font-black text-2xl mb-2" style={{ color: currentSponsor.textCol }}>{currentSponsor.name}</h3>
                    <p className="text-sm font-medium opacity-80" style={{ color: currentSponsor.textCol }}>{currentSponsor.text}</p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100 space-y-3">
                    {isActive && (
                        <button
                            onClick={() => setIsActive(false)}
                            className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Pause className="w-5 h-5 fill-current" /> Pause Session
                        </button>
                    )}

                    <button
                        onClick={() => {
                            setPermissionRequested(true);
                            setTimeout(() => setPermissionRequested(false), 120000);
                        }}
                        disabled={!isActive || permissionRequested}
                        className="w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold hover:border-indigo-100 hover:text-indigo-600 transition-colors disabled:opacity-50 text-sm"
                    >
                        {permissionRequested ? 'Research Mode: 01:59 remaining' : 'Need 2 min for Research?'}
                    </button>
                </div>

            </div>
        </div>
    );
}
