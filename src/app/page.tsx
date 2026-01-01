'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import StudySession from '@/components/StudySession';
import Leaderboard from '@/components/Leaderboard';
import StockMarket from '@/components/StockMarket';
import { LogIn, Zap, Battery, Wifi, User, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [studyTime, setStudyTime] = useState(25);
  const [isCommuteMode, setIsCommuteMode] = useState(false);
  const { user, login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col gap-6">

      {/* 1. TOP BAR: Status Line */}
      <header className="flex items-center justify-between px-6 py-4 card-cockpit h-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[var(--accent-acid)] rounded-sm flex items-center justify-center text-black">
            <LayoutDashboard size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase">Focus Flow</h1>
            <div className="text-[10px] text-[var(--accent-acid)] font-mono tracking-widest uppercase">System Operational</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-[var(--text-secondary)] text-xs font-mono tracking-wider">
            <div className="flex items-center gap-2"><Wifi size={14} /> LINKED</div>
            <div className="flex items-center gap-2"><Battery size={14} /> 100%</div>
            <div className="text-[var(--accent-acid)]">v2.0 TAYCAN</div>
          </div>

          {!user ? (
            <button onClick={handleLogin} className="btn-porsche btn-primary">
              <LogIn size={16} /> CONNECT
            </button>
          ) : (
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right">
                <div className="text-xs font-bold text-white tracking-wider">{user.displayName || 'PILOT'}</div>
                <div className="text-[10px] text-[var(--text-secondary)] font-mono">ID: {user.uid.slice(0, 6)}</div>
              </div>
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-sm border border-white/20" />
              ) : (
                <div className="w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center text-white"><User size={18} /></div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 2. MAIN COCKPIT GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT PANEL: Telemetry (Stocks & Leaderboard) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Stock Market Widget */}
          <div className="card-cockpit p-6 flex-1 min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-label text-[var(--accent-acid)]">Market Telemetry</h2>
              <div className="w-2 h-2 rounded-full bg-[var(--accent-acid)] animate-pulse shadow-[0_0_8px_var(--accent-acid)]"></div>
            </div>
            <StockMarket />
          </div>

          {/* Leaderboard Widget */}
          <div className="card-cockpit p-6 flex-1 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-label">Global Rankings</h2>
            </div>
            <Leaderboard preview={true} />
          </div>
        </div>

        {/* RIGHT PANEL: Instrumentation (Timer & Controls) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="card-cockpit p-8 flex-1 flex flex-col items-center justify-center relative min-h-[600px]">

            {/* Decoration Lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--glass-border)] to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-[var(--text-secondary)] font-mono text-xs opacity-50">
              FOCUS_MODULE_INIT<br />
              LATENCY: 4ms
            </div>

            {/* Session Component (The Speedometer) */}
            <div className="w-full max-w-2xl">
              {!user ? (
                <div className="text-center space-y-4">
                  <div className="text-6xl font-black text-[var(--surface-highlight)] tracking-tighter select-none">LOCKED</div>
                  <div className="text-[var(--text-secondary)] tracking-widest uppercase text-sm">Authentication Required for Ignition</div>
                </div>
              ) : (
                !sessionStarted ? (
                  /* Setup Phase */
                  <div className="flex flex-col items-center w-full animate-rev">
                    <div className="w-full max-w-md mb-12 relative group">
                      <div className="flex justify-between text-label mb-2">
                        <span>Duration</span>
                        <span className="text-[var(--accent-acid)] font-mono text-lg">{studyTime} MIN</span>
                      </div>
                      <input
                        type="range" min="5" max="120" step="5" value={studyTime}
                        onChange={(e) => setStudyTime(Number(e.target.value))}
                        className="w-full h-1 bg-[var(--surface-highlight)] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-[var(--accent-acid)] [&::-webkit-slider-thumb]:shadow-[0_0_10px_var(--accent-acid)]"
                      />
                      <div className="flex justify-between mt-2 text-[10px] text-[var(--text-secondary)] font-mono">
                        <span>05</span>
                        <span>60</span>
                        <span>120</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-12 p-4 border border-[var(--glass-border)] rounded-sm bg-white/5 w-full max-w-md justify-between cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setIsCommuteMode(!isCommuteMode)}>
                      <div>
                        <div className="text-label text-white mb-1">Commute Mode</div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Optimized for travel. 1.5x Multiplier.</div>
                      </div>
                      <div className={`toggle-switch ${isCommuteMode ? 'active' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>

                    <button
                      onClick={() => setSessionStarted(true)}
                      className="btn-porsche btn-primary text-lg w-full max-w-sm h-16"
                    >
                      <Zap className="fill-current" /> START ENGINE
                    </button>
                  </div>
                ) : (
                  /* Active Session */
                  <StudySession initialDuration={studyTime} isCommuteMode={isCommuteMode} />
                )
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
