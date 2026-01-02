import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Trophy, Clock, Zap, Activity } from 'lucide-react';

export default function PilotLog() {
    const [points] = useLocalStorage<number>('user_xp_points', 0, 1);
    const [totalMinutes] = useLocalStorage<number>('pilot_stats_minutes', 0, 1);
    const [pilotName] = useLocalStorage<string>('pilot_identity', 'PILOT', 1);

    // Calculate level based on points (simple logic: 100 XP per level)
    const level = Math.floor(points / 100) + 1;
    const progress = (points % 100);

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Header / ID Card */}
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-[var(--surface-highlight)] border border-[var(--glass-border)] rounded-sm flex items-center justify-center">
                    <Trophy size={20} className="text-[var(--accent-acid)]" />
                </div>
                <div>
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Flight Recorder</div>
                    <div className="text-lg font-bold text-white tracking-wider">{pilotName}</div>
                </div>
                <div className="ml-auto text-right">
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Level</div>
                    <div className="text-xl font-mono text-[var(--accent-acid)]">{level}</div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 flex-1">
                {/* Total Flight Time */}
                <div className="bg-[var(--surface-metallic)] border border-[var(--glass-border)] p-3 rounded-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Clock size={32} />
                    </div>
                    <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">Total Flight Time</div>
                    <div className="text-2xl font-mono text-white">
                        {Math.floor(totalMinutes / 60)}<span className="text-xs text-[var(--text-secondary)] font-sans">h</span> {totalMinutes % 60}<span className="text-xs text-[var(--text-secondary)] font-sans">m</span>
                    </div>
                </div>

                {/* Total XP */}
                <div className="bg-[var(--surface-metallic)] border border-[var(--glass-border)] p-3 rounded-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Zap size={32} />
                    </div>
                    <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">Career XP</div>
                    <div className="text-2xl font-mono text-white">{points.toLocaleString()}</div>
                </div>
            </div>

            {/* XP Bar */}
            <div className="mt-1">
                <div className="flex justify-between text-[9px] text-[var(--text-secondary)] mb-1 uppercase tracking-widest">
                    <span>Progress to Lvl {level + 1}</span>
                    <span>{progress}/100 XP</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--surface-highlight)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[var(--accent-acid)] shadow-[0_0_10px_var(--accent-acid)] transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="text-[9px] text-[var(--text-secondary)] font-mono opacity-50 text-center mt-1">
                LOG_ID: {Date.now().toString(36).toUpperCase()} // SYNCED
            </div>
        </div>
    );
}
