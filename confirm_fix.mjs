import YahooFinance from 'yahoo-finance2';

async function run() {
    try {
        const yahooFinance = new YahooFinance();
        const res = await yahooFinance.quote('HDFCBANK.NS');
        console.log("Success!", res.symbol, res.regularMarketPrice);
    } catch (e) {
        console.error("Fail:", e);
    }
}

run();
