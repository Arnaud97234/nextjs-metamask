const { Utils, Network } = require('alchemy-sdk')
const { AlchemyMultichainClient } = require('./alchemy-multichain-client')

var express = require('express')
var router = express.Router()
require('dotenv').config()

const network = Network.ETH_MAINNET

const defaultConfig = {
    apiKey: process.env.API_KEY,
    network: network,
}

const overrides = {
    [Network.MATIC_MAINNET]: { apiKey: process.env.API_KEY, maxRetries: 10 },
    [Network.ARB_MAINNET]: { apiKey: process.env.API_KEY },
}
const alchemy = new AlchemyMultichainClient(defaultConfig, overrides)

const networksList = {
    '0x1': Network.ETH_MAINNET,
    '0x89': Network.MATIC_MAINNET,
    '0xa4b1': Network.ARB_MAINNET,
}

/* GET home page. */
router.get('/:address/:chain', async function (req, res) {
    const address = req.params.address
    const chainId = req.params.chain
    let balance = await alchemy
        .forNetwork(networksList[chainId])
        .core.getBalance(address, 'latest')
    let nativeBalance = Utils.formatEther(balance, 'ether')
    let networkInfo = await alchemy
        .forNetwork(networksList[chainId])
        .core.getNetwork(address)
    let ens
    ;(await networkInfo.name) === 'homestead'
        ? (ens = await alchemy
              .forNetwork(networksList[Network.ETH_MAINNET])
              .core.lookupAddress(address))
        : (ens = false)
    let blockHeight = await alchemy
        .forNetwork(networksList[chainId])
        .core.getBlockNumber()

    !networksList.hasOwnProperty(chainId)
        ? res.status(500).json({ error: 'Network not supported' })
        : res.json({
              nativeBalance,
              ens: ens,
              network: networkInfo.name,
              chainId: networkInfo.chainId,
              blockHeight,
          })
})

module.exports = router
