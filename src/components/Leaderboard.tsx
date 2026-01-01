'use client';

import React from 'react';
import { Trophy, Crown, Medal } from 'lucide-react';

const MOCK_LEADERS = [
    { rank: 1, name: "Sneha G.", points: 12500, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sneha", streak: 45, location: 'Nelamangala' },
    { rank: 2, name: "Rahul K.", points: 11200, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rahul", streak: 32, location: 'Bangalore' },
    { rank: 3, name: "Amit S.", points: 10800, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Amit", streak: 12, location: 'Nelamangala' },
    { rank: 4, name: "Priya M.", points: 9500, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya", streak: 8, location: 'Mysore' },
    { rank: 5, name: "Vikram R.", points: 9200, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Vikram", streak: 5, location: 'Nelamangala' },
];

export default function Leaderboard({ preview = false }) {
    const [filter, setFilter] = React.useState<'Global' | 'Nelamangala'>('Global');

    const filteredLeaders = filter === 'Global'
        ? MOCK_LEADERS
        : MOCK_LEADERS.filter(l => l.location === 'Nelamangala');

    return (
        <div className="w-full">
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                <button
                    onClick={() => setFilter('Global')}
                    className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'Global' ? 'text-[var(--accent-acid)] border-b-2 border-[var(--accent-acid)]' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                    Global Grid
                </button>
                <button
                    onClick={() => setFilter('Nelamangala')}
                    className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'Nelamangala' ? 'text-[var(--accent-acid)] border-b-2 border-[var(--accent-acid)]' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                    Nelamangala Circuit
                </button>
            </div>

            {/* Racing Grid List */}
            <div className="flex flex-col gap-1">
                {/* Header Row */}
                <div className="flex items-center justify-between px-4 py-2 text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
                    <span>Pos / Pilot</span>
                    <span>Score</span>
                </div>

                {filteredLeaders.slice(0, preview ? 5 : 10).map((user, index) => (
                    <div key={user.rank} className={`group flex items-center justify-between p-3 rounded-sm border-l-2 transition-all ${user.rank === 1 ? 'bg-white/5 border-[var(--accent-acid)]' : 'border-transparent hover:bg-white/5 hover:border-white/20'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`font-mono font-bold w-6 text-center ${user.rank <= 3 ? 'text-[var(--accent-acid)]' : 'text-[var(--text-secondary)]'}`}>
                                {user.rank}
                            </div>
                            <div className="flex items-center gap-3">
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-sm grayscale group-hover:grayscale-0 transition-all border border-white/10" />
                                <div>
                                    <h4 className="font-bold text-white text-sm tracking-wide uppercase">{user.name}</h4>
                                    <div className="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-2">
                                        <span>{user.location}</span>
                                        <span className="text-[var(--accent-acid)]">STREAK: {user.streak}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="font-mono font-bold text-white text-sm tracking-tighter">
                            {user.points.toLocaleString()} <span className="text-[10px] text-[var(--text-secondary)]">XP</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
