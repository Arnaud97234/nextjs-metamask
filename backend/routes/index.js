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
    '0xaa36a7': Network.ETH_SEPOLIA,
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

/* GET transactions */
router.get('/:address/:chain/transactions/', async function (req, res) {
    const address = req.params.address
    const chainId = req.params.chain
    let response = await alchemy
        .forNetwork(networksList[chainId])
        .core.getAssetTransfers({
            fromBlock: '0x0',
            fromAddress: address,
            excludeZeroValue: true,
            category: ['erc20'],
        })
    res.json({
        response,
    })
})

/* GET Tokens */
router.get('/:address/:chain/tokens', async function (req, res) {
    const address = req.params.address
    const chainId = req.params.chain
    let response = await alchemy
        .forNetwork(networksList[chainId])
        .core.getTokensForOwner(address)

    res.json({ response })
})

/* GET nfts */
router.get('/:address/:chain/nfts', async function (req, res) {
    const address = req.params.address
    const chainId = req.params.chain
    const response = await alchemy
        .forNetwork(networksList[chainId])
        .nft.getContractsForOwner(address)
    const filtered = response.contracts.map((e) => {
        const checkSymbol = () => {
            let symbol = e.symbol.toLocaleLowerCase()
            let test
            if (
                !symbol ||
                symbol.includes('fortnite') ||
                symbol.includes('enjpool.com') ||
                symbol.includes('airdrop') ||
                symbol.includes('reward')
            ) {
                test = true
            }
            return test
        }
        if (!e.isSpam && e.symbol && !checkSymbol()) {
            return {
                name: e.name,
                contract: e.address,
                symbol: e.symbol,
                type: e.tokenType,
                image: e.image,
                balance: e.totalBalance,
            }
        }
    })
    const contracts = await filtered.filter((e) => e)
    const contractsList = await contracts.map((e) => {
        return e.contract
    })
    const nftsList = await alchemy
        .forNetwork(networksList[chainId])
        .nft.getNftsForOwner(address, {
            contractAddresses: contractsList,
        })

    const nftsByCollection = async () => {
        let result = []
        await contracts.map((collection) => {
            let list = []
            nftsList &&
                nftsList.ownedNfts.map((nft) => {
                    nft.contract.address == collection.contract &&
                        list.push({
                            name: nft.name,
                            desc: nft.description,
                            tokenId: nft.tokenId,
                            tokenUri: nft.tokenUri,
                            image: nft.image,
                        })
                })
            result.push({ collection, nfts: list })
        })
        return result
    }

    res.json(await nftsByCollection())
})

module.exports = router
