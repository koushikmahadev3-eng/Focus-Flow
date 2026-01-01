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
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Ticker</div>
                <div className="text-[10px] text-[var(--accent-acid)] uppercase tracking-widest font-bold flex items-center gap-2">
                    <Briefcase size={12} />
                    {Object.values(portfolio).reduce((a, b) => a + b, 0)} Units
                </div>
            </div>

            <div className="space-y-2">
                {MOCK_STOCKS.map(stock => (
                    <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-sm border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-black text-[10px] ${stock.change >= 0 ? 'bg-[var(--accent-acid)]' : 'bg-[var(--accent-alert)]'}`}>
                                {stock.symbol.substring(0, 1)}
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm tracking-wide">{stock.symbol}</div>
                                <div className={`text-[10px] font-mono flex items-center gap-1 ${stock.change >= 0 ? 'text-[var(--accent-acid)]' : 'text-[var(--accent-alert)]'}`}>
                                    {stock.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                    {stock.change}%
                                </div>
                            </div>
                        </div>

                        <div className="text-right flex items-center gap-4">
                            <div>
                                <div className="font-mono font-bold text-white text-sm">💎 {stock.price}</div>
                                <div className="text-[10px] text-[var(--text-secondary)] uppercase">
                                    QTY: {portfolio[stock.symbol] || 0}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleBuy(stock)} className="px-2 py-0.5 bg-[var(--accent-acid)] text-black rounded-sm text-[10px] font-bold hover:bg-white">BUY</button>
                                <button onClick={() => handleSell(stock)} className="px-2 py-0.5 border border-white/20 text-white rounded-sm text-[10px] font-bold hover:bg-white/10">SELL</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
