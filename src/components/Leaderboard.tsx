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
            <div className="flex gap-4 mb-8 justify-center">
                <button
                    onClick={() => setFilter('Global')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'Global' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    Global
                </button>
                <button
                    onClick={() => setFilter('Nelamangala')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'Nelamangala' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    📍 Nelamangala
                </button>
            </div>
            {/* Top 3 Podium - Only on Dashboard */}
            {!preview && (
                <div className="flex items-end justify-center gap-4 mb-12 px-4 h-64">
                    {/* Rank 2 */}
                    <div className="flex flex-col items-center w-1/3">
                        <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-white shadow-lg mb-4 flex items-center justify-center text-2xl overflow-hidden">
                            <img src={MOCK_LEADERS[1].avatar} alt="" />
                        </div>
                        <div className="w-full bg-gray-100 rounded-t-2xl h-32 flex flex-col items-center justify-center border-t-4 border-gray-300 relative">
                            <div className="text-3xl font-black text-gray-300 mb-1">2</div>
                            <div className="text-xs font-bold text-gray-500">Gaming Chair</div>
                        </div>
                    </div>

                    {/* Rank 1 */}
                    <div className="flex flex-col items-center w-1/3 z-10">
                        <Crown className="w-8 h-8 text-yellow-500 fill-current mb-2 animate-bounce" />
                        <div className="w-20 h-20 rounded-full bg-yellow-100 border-4 border-white shadow-xl mb-4 flex items-center justify-center text-2xl overflow-hidden ring-4 ring-yellow-50">
                            <img src={MOCK_LEADERS[0].avatar} alt="" />
                        </div>
                        <div className="w-full bg-yellow-50 rounded-t-2xl h-40 flex flex-col items-center justify-center border-t-4 border-yellow-400 relative shadow-lg">
                            <span className="absolute -top-3 bg-yellow-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">WINNER</span>
                            <div className="text-4xl font-black text-yellow-500 mb-1">1</div>
                            <div className="text-xs font-bold text-yellow-700">Redmi Phone</div>
                        </div>
                    </div>

                    {/* Rank 3 */}
                    <div className="flex flex-col items-center w-1/3">
                        <div className="w-16 h-16 rounded-full bg-orange-100 border-4 border-white shadow-lg mb-4 flex items-center justify-center text-2xl overflow-hidden">
                            <img src={MOCK_LEADERS[2].avatar} alt="" />
                        </div>
                        <div className="w-full bg-orange-50 rounded-t-2xl h-24 flex flex-col items-center justify-center border-t-4 border-orange-300 relative">
                            <div className="text-3xl font-black text-orange-300 mb-1">3</div>
                            <div className="text-xs font-bold text-orange-600">Buds</div>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="flex flex-col gap-3">
                {filteredLeaders.slice(0, preview ? 3 : 10).map((user, index) => (
                    <div key={user.rank} className="bg-white p-4 rounded-xl flex items-center justify-between border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="font-bold text-gray-400 w-6 text-center">{user.rank}</div>
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-50" />
                            <div>
                                <h4 className="font-bold text-gray-800">{user.name} <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-2">{user.location}</span></h4>
                                <div className="text-xs text-gray-500 font-medium">🔥 {user.streak} day streak</div>
                            </div>
                        </div>

                        <div className="font-black text-indigo-600">
                            {user.points.toLocaleString()}
                        </div>
                    </div>
                ))}
                {preview && (
                    <button className="w-full py-3 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors mt-2">
                        View All Rankers →
                    </button>
                )}
            </div>
        </div>
    );
}
