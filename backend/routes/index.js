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

/* GET wallet */
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
    const spams = [
        '0x08e1d08db3fd8dd33e040176ad3ea09b7242a8f0',
        '0x11cc04dd962e82d411587c56b815e8f8141eb7d5',
        '0x1412eca9dc7daef60451e3155bb8dbf9da349933',
        '0x3d201c408b9eaddc76e27ad45d986c4d9c13e0c6',
        '0x6e51e1fbd089587d6f58bc9b70efe1cf85642c02',
        '0x8fa451eaa1dd5ad6c7227d5a2aaf2a4f8888a3df',
        '0xb699dab9b3f981a01abc0474f085427d20d0d602',
        '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e',
        '0xc92e74b131d7b1d46e60e07f3fae5d8877dd03f0',
        '0xd1e61fcb6e26d4deffa77f21cc5b581c3afa95e2',
        '0xd667a84005975eef906e980f200541974a8c9766',
        '0xdacfc5582c56a2f16d8a71ff1f79be145db5333d',
        '0xdc053dbc608cceaa3ef551aa4597643eafdb6cda',
        '0xe00cd9b8ebb503e4be266983efc6158fcffe0004',
        '0xe0923e597cb4b48e2ee122604b4241cbd6d93497',
        '0xe23366cccf6c5318b47621ceac3296d480b5ebc8',
    ]
    let response = await alchemy
        .forNetwork(networksList[chainId])
        .core.getTokensForOwner(address)
    const filtered = async () => {
        let result = []
        await response.tokens.map((token) => {
            !spams.includes(token.contractAddress) && result.push(token)
        })
        return result
    }

    res.json(await filtered())
})

/* GET nfts */
router.get('/:address/:chain/nfts', async function (req, res) {
    const address = req.params.address
    const chainId = req.params.chain
    const response = await alchemy
        .forNetwork(networksList[chainId])
        .nft.getContractsForOwner(address)
    const filtered = await response.contracts.map((e) => {
        const checkSymbol = () => {
            let symbol = e.symbol.toLocaleLowerCase()
            console.log(`Contract Address: ${e.contract}`)
            let test
            if (
                !symbol ||
                symbol.includes('fortnite') ||
                symbol.includes('enjpool.com') ||
                symbol.includes('airdrop') ||
                symbol.includes('reward')
                // e.collection.contractAddress ==
                //     '0x86083B74A4165754D20724cB719d9fAf7774FB22' ||
                // e.collection.contractAddress ==
                //     '0xf889dd6AD49D49d4b3e1f8212f00fFb38FADc300'
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
                tokenType: e.tokenType,
                image: e.openSeaMetadata.imageUrl,
                balance: e.totalBalance,
                description: e.openSeaMetadata.description,
                slug: e.openSeaMetadata.collectionSlug,
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
