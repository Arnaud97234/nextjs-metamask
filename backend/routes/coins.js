var express = require('express')
var router = express.Router()
require('dotenv').config()

router.post('/:countervalues', async function (req, res) {
    const countervalues = req.params.countervalues
    const apiKey = process.env.CMC_API_KEY

    const coinsList = await req.body.coinsList

    const symbolsList = await coinsList.map((e) => {
        return e.symbol
    })

    try {
        await fetch(
            `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbolsList}&convert=${countervalues}`,
            {
                headers: {
                    'x-CMC_PRO_API_KEY': apiKey,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                let { timestamp, error_code, error_message } = data.status
                let quotes = data.data
                const array = coinsList.map((e) => {
                    let token = quotes[e.symbol][0]
                    if (quotes[e.symbol]) {
                        if (token?.platform?.slug != 'solana') {
                            return token
                        }
                    }
                })

                res.json({
                    status: { timestamp, error_code, error_message },
                    quotes: array.filter((e) => e),
                })
            })
    } catch (err) {
        res.json({ err: 'Error while fetching coins data' })
    }
})

module.exports = router
