const express = require('express');
const cors = require('cors')
const yahooFinance = require('yahoo-finance2').default;
const app = express();
app.use(express.json());
app.use(cors())
const PORT = process.env.PORT || 3000;

app.get('/priceUpdates/:id', async (request, response) => {
    const symbol = request.params.id;
    const queryOptions = {};
    const moduleOptions = {};

    const quoteData = await yahooFinance.quote(symbol, queryOptions, moduleOptions);
    const fields = ["symbol", "displayName", "fiftyTwoWeekLow", "fiftyTwoWeekHigh", "regularMarketDayRange"];

    const filteredData = fields.reduce((acc, field) => {
        if (quoteData[field] !== undefined) {
            acc[field] = quoteData[field];
        }
        return acc;
    }, {});

    response.send(quoteData);
});
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});