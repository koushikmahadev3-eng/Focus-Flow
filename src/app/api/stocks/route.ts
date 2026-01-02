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

        const formattedData = quotes.map(quote => {
            const price = quote.regularMarketPrice || quote.postMarketPrice || 0;
            const prevClose = quote.regularMarketPreviousClose || price;
            // Calculate change if API returns null/undefined (common with Yahoo free tier)
            let changePercent = quote.regularMarketChangePercent;

            if (changePercent === undefined || changePercent === null) {
                if (prevClose > 0) {
                    changePercent = ((price - prevClose) / prevClose) * 100;
                } else {
                    changePercent = 0;
                }
            }

            return {
                symbol: quote.symbol.replace('.NS', ''),
                name: quote.shortName || quote.longName || quote.symbol,
                price: price,
                change: parseFloat(changePercent.toFixed(2)),
                currency: '₹'
            };
        });

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Stock Fetch Error:", error);
        // Fallback for when API fails (e.g. rate limits) to avoid breaking UI
        return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
    }
}
