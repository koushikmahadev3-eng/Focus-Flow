import YahooFinance from 'yahoo-finance2';

async function run() {
    try {
        const yahooFinance = new YahooFinance();
        const res = await yahooFinance.quote('HDFCBANK.NS');
        console.log("Market State:", res.marketState);
        console.log("Regular:", res.regularMarketPrice, res.regularMarketTime);
        console.log("Post:", res.postMarketPrice, res.postMarketTime);
        console.log("Pre:", res.preMarketPrice, res.preMarketTime);
        console.log("Full Res:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.error("Fail:", e);
    }
}

run();
