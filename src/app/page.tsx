'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import StudySession from '@/components/StudySession';
import Leaderboard from '@/components/Leaderboard';
import StockMarket from '@/components/StockMarket';
import { Play, LogIn, Target, Zap, Gift, BookOpen, Star } from 'lucide-react';

export default function Home() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [studyTime, setStudyTime] = useState(25);
  const [isCommuteMode, setIsCommuteMode] = useState(false);
  const { user, login } = useAuth();

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden text-gray-800">

      {/* Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-200/40 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {sessionStarted ? (
        <div className="container mx-auto p-4 z-10 animate-pop-in max-w-7xl">
          <button
            onClick={() => setSessionStarted(false)}
            className="mb-8 px-6 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-bold text-gray-600 hover:text-indigo-600 hover:shadow-md transition-all flex items-center gap-2 w-fit"
          >
            ← Dashboard
          </button>
          <StudySession initialDuration={studyTime} isCommuteMode={isCommuteMode} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center relative p-6">

          {/* Hero Section */}
          <div className="max-w-5xl w-full text-center space-y-10 animate-pop-in">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white shadow-sm border border-indigo-100 mb-6">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
              <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase">Gamified Learning V1.0</span>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 leading-[1.1]">
              Make Studying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"> addictive.</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Earn <span className="text-indigo-600 font-bold bg-indigo-50 px-2 rounded">Real Rewards</span> for every minute you focus.
              Our AI keeps you honest so you can win big.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto mb-8 bg-white/50 p-6 rounded-3xl border border-white shadow-sm backdrop-blur-sm">
                <div className="w-full">
                  <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                    <span>Session Duration</span>
                    <span className="text-indigo-600">{studyTime} Minutes</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={studyTime}
                    onChange={(e) => setStudyTime(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between w-full bg-indigo-50 p-4 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => setIsCommuteMode(!isCommuteMode)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCommuteMode ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-400'}`}>
                      {isCommuteMode ? <Zap className="w-5 h-5 fill-current" /> : <div className="w-5 h-5" />}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-800">Commute Mode</div>
                      <div className="text-xs text-gray-500">Studying properly while traveling?</div>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isCommuteMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isCommuteMode ? 'translate-x-6' : ''}`} />
                  </div>
                </div>
              </div>

              {!user ? (
                <button
                  onClick={login}
                  className="btn-primary px-10 py-5 rounded-full font-bold text-xl flex items-center gap-3 shadow-indigo-200 hover:shadow-indigo-300 w-full justify-center"
                >
                  <LogIn className="w-6 h-6" />
                  Join to Win
                </button>
              ) : (
                <button
                  onClick={() => setSessionStarted(true)}
                  className="btn-primary px-12 py-5 rounded-full font-bold text-xl flex items-center gap-3 shadow-indigo-200 hover:shadow-indigo-300 w-full justify-center"
                >
                  <Play className="fill-white w-6 h-6" />
                  Start Focus Session
                </button>
              )}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
              <div className="glass-panel p-8 bg-white/80">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 text-blue-600 shadow-sm">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Stay Focused</h3>
                <p className="text-gray-500 leading-relaxed font-medium">Smart AI webcam detection ensures you don't scroll away. It's like a personal trainer for your brain.</p>
              </div>

              <div className="glass-panel p-8 bg-white/80">
                <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mb-6 text-yellow-600 shadow-sm">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Earn XP</h3>
                <p className="text-gray-500 leading-relaxed font-medium">Get 2 XP for every minute. Build streaks to unlock massive multipliers and climb the ranks.</p>
              </div>

              <div className="glass-panel p-8 bg-white/80">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center mb-6 text-pink-600 shadow-sm">
                  <Gift className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Win Gadgets</h3>
                <p className="text-gray-500 leading-relaxed font-medium">Top the weekly leaderboard to win Redmi phones, Gaming Chairs, and more.</p>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="mt-24 w-full max-w-4xl mx-auto bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="text-left">
                  <h2 className="text-3xl font-black text-gray-900">Live Rankings</h2>
                  <p className="text-gray-400 font-medium">See who's winning right now</p>
                </div>
                <div className="text-2xl">🏆</div>
              </div>
              <Leaderboard preview={true} />

              <div className="mt-12">
                <h2 className="text-3xl font-black text-gray-900 mb-6 text-left">Virtual Market</h2>
                <p className="text-gray-500 mb-8 text-left">Spend your hard-earned points on virtual stocks.</p>
                <StockMarket />
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
