import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export const runtime = 'nodejs'; // fetching requires nodejs runtime, not edge for this lib usually

export async function GET() {
    // Symbols for Indian Market (NSE)
    const symbols = [
        'HDFCBANK.NS',
        'RELIANCE.NS',
        'INFY.NS',
        'TATASTEEL.NS',
        'ZOMATO.NS',
        'PAYTM.NS'
    ];

    try {
        const quotes = await yahooFinance.quote(symbols) as any[];

        const formattedData = quotes.map(quote => ({
            symbol: quote.symbol.replace('.NS', ''), // Clean name for UI
            name: quote.shortName || quote.longName || quote.symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChangePercent,
            currency: '₹'
        }));

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Stock Fetch Error:", error);
        // Fallback for when API fails (e.g. rate limits) to avoid breaking UI
        return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
    }
}
