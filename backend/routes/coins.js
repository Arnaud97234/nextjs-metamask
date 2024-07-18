var express = require('express')
var router = express.Router()
require('dotenv').config()

router.get('/:currencies/:fiats', async function (req, res) {
    const currencies = req.params.currencies
    const countervalues = req.params.fiats
    const apiKey = process.env.CMC_API_KEY
    try {
        await fetch(
            `https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${currencies}&convert=${countervalues}`,
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
                res.json({
                    status: { timestamp, error_code, error_message },
                    quotes,
                })
            })
    } catch (err) {
        res.json({ err })
    }
})

module.exports = router
