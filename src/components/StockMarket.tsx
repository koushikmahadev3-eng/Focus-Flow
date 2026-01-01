'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';

const MOCK_STOCKS = [
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1530, change: 1.2 },
    { symbol: 'RELIANCE', name: 'Reliance Ind.', price: 2450, change: -0.5 },
    { symbol: 'INFY', name: 'Infosys', price: 1420, change: 0.8 },
    { symbol: 'TATASTEEL', name: 'Tata Steel', price: 120, change: 2.1 },
];

export default function StockMarket() {
    const [portfolio, setPortfolio] = useState<Record<string, number>>({});
    const [userPoints, setUserPoints] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('userParams_points');
        if (saved) setUserPoints(parseInt(saved));

        const savedPort = localStorage.getItem('userParams_portfolio');
        if (savedPort) setPortfolio(JSON.parse(savedPort));
    }, []);

    const handleBuy = (stock: typeof MOCK_STOCKS[0]) => {
        if (userPoints >= stock.price) {
            const newPoints = userPoints - stock.price;
            const newPort = { ...portfolio, [stock.symbol]: (portfolio[stock.symbol] || 0) + 1 };

            setUserPoints(newPoints);
            setPortfolio(newPort);

            localStorage.setItem('userParams_points', newPoints.toString());
            localStorage.setItem('userParams_portfolio', JSON.stringify(newPort));

            // Dispatch event to sync points across components if needed (simple hack for now)
            window.dispatchEvent(new Event('storage'));
        } else {
            alert("Insufficient Points! Study more to earn.");
        }
    };

    const handleSell = (stock: typeof MOCK_STOCKS[0]) => {
        if (portfolio[stock.symbol] > 0) {
            const newPoints = userPoints + stock.price;
            const newPort = { ...portfolio, [stock.symbol]: portfolio[stock.symbol] - 1 };

            setUserPoints(newPoints);
            setPortfolio(newPort);

            localStorage.setItem('userParams_points', newPoints.toString());
            localStorage.setItem('userParams_portfolio', JSON.stringify(newPort));
        }
    };

    return (
        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600" /> Market
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">Invest your Study Points</p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-bold text-sm flex items-center gap-2">
                    <Briefcase size={16} />
                    {Object.values(portfolio).reduce((a, b) => a + b, 0)} Assets
                </div>
            </div>

            <div className="space-y-4">
                {MOCK_STOCKS.map(stock => (
                    <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs ${stock.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                                {stock.symbol.substring(0, 1)}
                            </div>
                            <div>
                                <div className="font-bold text-gray-800">{stock.symbol}</div>
                                <div className={`text-xs font-bold flex items-center gap-1 ${stock.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {stock.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                    {stock.change}%
                                </div>
                            </div>
                        </div>

                        <div className="text-right flex items-center gap-4">
                            <div>
                                <div className="font-mono font-bold text-gray-800">💎 {stock.price}</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                                    Owned: {portfolio[stock.symbol] || 0}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleBuy(stock)} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200">Buy</button>
                                <button onClick={() => handleSell(stock)} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200">Sell</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
