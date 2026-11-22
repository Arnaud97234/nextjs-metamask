var express = require('express')
var router = express.Router()
require('dotenv').config()

router.post('/:countervalues', async function (req, res) {
    try {
        const countervalues = req.params.countervalues
        const apiKey = process.env.CMC_API_KEY

        // Validate input
        if (!req.body.coinsList || !Array.isArray(req.body.coinsList)) {
            return res.status(400).json({ error: 'Invalid coins list provided' })
        }

        const coinsList = req.body.coinsList

        // Validate that we have a valid API key
        if (!apiKey) {
            return res.status(500).json({ error: 'CoinMarketCap API key not configured' })
        }

        const symbolsList = coinsList.map((e) => e.symbol)

        // Validate that we have symbols to fetch
        if (symbolsList.length === 0) {
            return res.json({ status: {}, quotes: [] })
        }

        const response = await fetch(
            `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbolsList}&convert=${countervalues}`,
            {
                headers: {
                    'x-CMC_PRO_API_KEY': apiKey,
                },
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        let { timestamp, error_code, error_message } = data.status
        let quotes = data.data

        const array = coinsList.map((e) => {
            let token = quotes?.[e.symbol]?.[0]
            if (quotes?.[e.symbol]) {
                if (token?.platform?.slug != 'solana') {
                    if (token?.tags) {
                        let newTags = token.tags.map((tag) => {
                            return tag.slug
                        })
                        token = { ...token, tags: newTags }
                    }
                }
            }
            return token
        })

        res.json({
            status: { timestamp, error_code, error_message },
            quotes: array.filter((e) => e),
        })
    } catch (err) {
        res.status(500).json({ error: 'Error while fetching coins data' })
    }
})

module.exports = router
