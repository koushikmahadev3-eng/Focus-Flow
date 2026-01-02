'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Briefcase } from 'lucide-react';

const INITIAL_STOCKS = [
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1530.00, change: 0.0 },
    { symbol: 'RELIANCE', name: 'Reliance Ind.', price: 2450.00, change: 0.0 },
    { symbol: 'INFY', name: 'Infosys', price: 1420.00, change: 0.0 },
    { symbol: 'TATASTEEL', name: 'Tata Steel', price: 120.00, change: 0.0 },
    { symbol: 'ZOMATO', name: 'Zomato', price: 85.50, change: 0.0 },
    { symbol: 'PAYTM', name: 'Paytm', price: 650.00, change: 0.0 },
];

export default function StockMarket() {
    const [stocks, setStocks] = useState(INITIAL_STOCKS);
    const [portfolio, setPortfolio] = useState<Record<string, number>>({});
    const [userPoints, setUserPoints] = useState(0);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('userParams_points');
        if (saved) setUserPoints(parseInt(saved));
        const savedPort = localStorage.getItem('userParams_portfolio');
        if (savedPort) setPortfolio(JSON.parse(savedPort));
    }, []);

    // 🔴 REAL MARKET DATA FETCH
    // Fetches from our internal API (which proxies Yahoo Finance)
    const fetchStockData = async () => {
        try {
            const res = await fetch('/api/stocks');
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();

            if (Array.isArray(data)) {
                setStocks(data);
            }
        } catch (error) {
            console.error("Failed to fetch stocks:", error);
            // Keep old data if fetch fails
        }
    };

    useEffect(() => {
        fetchStockData(); // Initial Fetch
        const interval = setInterval(fetchStockData, 15000); // Poll every 15 seconds (Standard API Limit safe)
        return () => clearInterval(interval);
    }, []);

    const handleBuy = (stock: any) => {
        if (userPoints >= stock.price) {
            const newPoints = userPoints - stock.price;
            const newPort = { ...portfolio, [stock.symbol]: (portfolio[stock.symbol] || 0) + 1 };
            setUserPoints(newPoints);
            setPortfolio(newPort);
            localStorage.setItem('userParams_points', newPoints.toString());
            localStorage.setItem('userParams_portfolio', JSON.stringify(newPort));
            window.dispatchEvent(new Event('storage'));
        } else {
            alert("Insufficient Funds!");
        }
    };

    const handleSell = (stock: any) => {
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
                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Yahoo Finance API</div>
                <div className="text-[10px] text-[var(--accent-acid)] uppercase tracking-widest font-bold flex items-center gap-2">
                    <Briefcase size={12} />
                    {Object.values(portfolio).reduce((a, b) => a + b, 0)} Units
                </div>
            </div>

            <div className="space-y-2">
                {stocks.map(stock => (
                    <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-sm border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-black text-[10px] ${stock.change >= 0 ? 'bg-[var(--accent-acid)]' : 'bg-[var(--accent-alert)]'} transition-colors duration-500`}>
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
                                <div className="font-mono font-bold text-white text-sm animate-pulse key={stock.price}">
                                    ₹ {stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="text-[10px] text-[var(--text-secondary)] uppercase">
                                    QTY: {portfolio[stock.symbol] || 0}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleBuy(stock)} className="px-2 py-0.5 bg-[var(--accent-acid)] text-black rounded-sm text-[10px] font-bold hover:bg-white hover:scale-105 transition-all">BUY</button>
                                <button onClick={() => handleSell(stock)} className="px-2 py-0.5 border border-white/20 text-white rounded-sm text-[10px] font-bold hover:bg-white/10 hover:scale-105 transition-all">SELL</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
                <div className="text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></span>
                    Data Delayed 15m
                </div>
                <div className="text-[9px] text-white/30 font-mono">
                    Updated: {new Date().toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
}
