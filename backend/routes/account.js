const { Utils, Network } = require('alchemy-sdk')
const { AlchemyMultichainClient } = require('./alchemy-multichain-client')

var express = require('express')
var router = express.Router()
require('dotenv').config()

// Debug environment variables
console.log('=== Environment Debug ===');
console.log('Loaded environment variables. ALCHEMY_API_KEY exists:', !!process.env.ALCHEMY_API_KEY);
console.log('ALCHEMY_API_KEY value (full):', process.env.ALCHEMY_API_KEY);
if (process.env.ALCHEMY_API_KEY) {
    console.log('ALCHEMY_API_KEY length:', process.env.ALCHEMY_API_KEY.length);
    console.log('ALCHEMY_API_KEY first 15 chars:', process.env.ALCHEMY_API_KEY.substring(0, 15));
    console.log('Starts with "alch_":', process.env.ALCHEMY_API_KEY.startsWith('alch_'));
    console.log('Starts with "-alch_":', process.env.ALCHEMY_API_KEY.startsWith('-alch_'));
}

const network = Network.ETH_MAINNET

// Validate API key
if (!process.env.ALCHEMY_API_KEY) {
    console.warn('WARNING: ALCHEMY_API_KEY not found in environment variables. This will cause API calls to fail.');
    console.warn('Please set your Alchemy API key in the .env file');
} else if (process.env.ALCHEMY_API_KEY === 'your_actual_alchemy_api_key_here') {
    console.warn('WARNING: ALCHEMY_API_KEY is still set to the placeholder value. This will cause API calls to fail.');
    console.warn('Please replace with your actual Alchemy API key');
} else if (process.env.ALCHEMY_API_KEY.startsWith('-alch_')) {
    console.warn('WARNING: ALCHEMY_API_KEY appears to be a demo key or malformed. This will cause authentication errors.');
    console.warn('Please replace with a valid Alchemy API key from https://alchemy.com/');
} else if (!process.env.ALCHEMY_API_KEY.startsWith('alch_')) {
    console.warn('WARNING: ALCHEMY_API_KEY does not start with "alch_". This might cause authentication errors.');
    console.warn('Valid keys should start with "alch_" prefix');
}

const defaultConfig = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: network,
}

const overrides = {
    [Network.MATIC_MAINNET]: {
        apiKey: process.env.ALCHEMY_API_KEY,
        maxRetries: 10,
    },
    [Network.ARB_MAINNET]: { apiKey: process.env.ALCHEMY_API_KEY },
}
const alchemy = new AlchemyMultichainClient(defaultConfig, overrides)

const networksList = {
    '0x1': Network.ETH_MAINNET,
    '0xaa36a7': Network.ETH_SEPOLIA,
    '0x89': Network.MATIC_MAINNET,
    '0xa4b1': Network.ARB_MAINNET,
    // Handle decimal chain IDs as well
    1: Network.ETH_MAINNET,
    11155111: Network.ETH_SEPOLIA,
    137: Network.MATIC_MAINNET,
    42161: Network.ARB_MAINNET,
}

const isSpam = (address, symbol) => {
    const spams = [
        '0xB66a603f4cFe17e3D27B87a8BfCaD319856518B8',
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
        '0x02677c45fa858b9ffec24fc791bf72cdf4a8a8df',
        '0x02c013cf08f2c504caefd71fab6bf8969bc3c819',
        '0x06ac6b82e79b6b70757b578d7fbd197ce73c4ee3',
        '0x0b91b07beb67333225a5ba0259d55aee10e3a578',
        '0x1a2d2769932f6ca3dcfeddd5866d9e7598d024e7',
        '0x15e2a3c1833d57fc2b43024cd16a552a1994de46',
        '0x1ef250b4a02505cfb4fba4d1ce1bb7e411851739',
        '0x21a95b532bc665548b7c0c8a4b047501f51c8d8a',
        '0x247833686b12791f258128788ce6d632796b342e',
        '0x2a636a1bf3379d27b646c0f2cf8f282898e76f45',
        '0x31f3a4a1643618ae9b8940c52f39727d23e8352e',
        '0x367dc874f135455001e5df13d3dbba0f91bf910d',
        '0x3a13f50683db34550e7ab7ad898293171cc8892e',
        '0x3b4cb73bee36a17f13546adf0c5860fbc53331cd',
        '0x43458017d9b057c9c2fe97e4629014cb9b66093e',
        '0x509a5b5ecdb5c55ced8a87f3b87b576c7463ead3',
        '0x10503dbed34e291655100a3c204528425abe3235',
        '0x4dc3643dbc642b72c158e7f3d2ff232df61cb6ce',
        '0x886f107df86a9c1b04340fbf7da610f55156802c',
        '0x8a0b040f27407d7a603bca701b857f8f81a1c7af',
        '0x92f1674a14754b353f7b123d6c5daf0d9d00dc56',
        '0xaf0cdaef003cd9e12eeed2536b53e8520f5fdc58',
        '0xa0b2b4b6e83d6523e940b8badd17e897b2bfeb7d',
        '0xbf89d0156cece2f2fc57001a0deb2774e87be909',
        '0xe14c0c5d0b407d6bcd3095f7b7f673279856eb52',
        '0x9335e0fef07fe5f94e7ad3f0475fb3a33f184219',
        '0xf15cceed8786ad113a2ba75f5578ce1a1ff565a2',
        '0xff99afd7dd09988d76c4aaab5798216617335b96',
        '0xf291ea66de48f48bfa7e78925019cce26b38ad92',
        '0xee41a9354e16e0514c96bba04a71b5e552886c05',
        '0xb27cea9e38eeb387d3b0672287ca304fbff00b7c',
        '0xb4eae0b6d272f85060fb48a8fe56835eda1333e8',
        '0xa39621f9d01792699d4368eef3031fef2aafd3ca',
        '0x7b0d195f3e798e42da49cf91df147a3f4bdda75c',
        '0x7f3dc24cfc1c5ba05d00e39fa922754330c5e429',
        '0x6d646fd533720ca547d74dcfe54b6b9549546fd6',
        '0x1cba5519248ab505c7ce936159135c062514c359',
        '0xd661cbe233ca7664382a3522d4e0a937c6c8b9c5',
        '0x664ad3109735282e7228844c078c24b231d90f73',
        '0x624471968090742312d1cd37a7f80c16b344d2af',
        '0x44369c4e359d2eec30d8f3639719edc9c56c9a5f',
        '0x552b1d48e46013482118134ace547062f31f9ff7',
        '0x3daa0376b8b65401d42f07815e5e4a7f9cd4cc65',
        '0x1661528dee8374a6c16cb488cf887a989e786d05',
        '0x81067076dcb7d3168ccf7036117b9d72051205e2',
        '0x9b8cc6320f22325759b7d2ca5cd27347bb4ecd86',
        '0xb1298414a308c71e4d84f1a467bc49b6740ae265',
        '0x6142f62e7996faec5c5bb9d10669d60299d69dfe',
        '0xf889dd6AD49D49d4b3e1f8212f00fFb38FADc300',
        '0x86083B74A4165754D20724cB719d9fAf7774FB22',
        '0x4f7c7196A4c7Ca429FAc05461f734e2Adb49dcC4',
        '0x57e0A744773A18D1f212B961985115C514160b3f',
        '0x4f39bAFFc187dD6c21846404C2d304A1bCfE1ADB',
        '0xcbf4ab00b6aa19b4d5d29c7c3508b393a1c01fe3',
        '0x6df5c1da0310a0725b919579d06de427cb578c83',
        '0x70784d8a360491562342b4f3d3d039aaacaf8f5d',
        '0xd4820c0519e42d9c14b5020d7ccc60b8664a5955',
        '0x2953399124F0cBB46d2CbACD8A89cF0599974963',
    ]
    if (
        !symbol ||
        symbol.toLowerCase().includes('fortnite') ||
        symbol.toLowerCase().includes('enjpool.com') ||
        symbol.toLowerCase().includes('airdrop') ||
        symbol.toLowerCase().includes('reward') ||
        spams.includes(address)
    ) {
        return true
    }
}

/* GET Account */
router.get('/:address/:chain', async function (req, res) {
    const address = req.params.address
    const chainId = req.params.chain

    // Normalize chain ID to handle both hex and decimal formats
    let normalizedChainId = chainId
    if (typeof chainId === 'string' && chainId.startsWith('0x')) {
        // Convert hex string to decimal number for lookup
        normalizedChainId = parseInt(chainId, 16)
    }

    console.log('Chain ID received:', chainId, 'Normalized to:', normalizedChainId);

    // Check if the network is supported
    const network = networksList[normalizedChainId] || networksList[chainId]

    console.log('Network determined:', network);

    if (!network) {
        return res.status(400).json({ error: 'Network not supported' })
    }

    try {
        console.log('Making Alchemy call for address:', address, 'on network:', network);

        let balance = await alchemy
            .forNetwork(network)
            .core.getBalance(address, 'latest')
        let nativeBalance = Utils.formatEther(balance, 'ether')
        let networkInfo = await alchemy
            .forNetwork(network)
            .core.getNetwork(address)
        let ens
        ;(await networkInfo.name) === 'homestead'
            ? (ens = await alchemy
                  .forNetwork(networksList[Network.ETH_MAINNET])
                  .core.lookupAddress(address))
            : (ens = false)
        let blockHeight = await alchemy
            .forNetwork(network)
            .core.getBlockNumber()

        res.json({
            nativeBalance,
            ens: ens,
            network: networkInfo.name,
            chainId: networkInfo.chainId,
            blockHeight,
        })
    } catch (error) {
        console.error('Detailed error in account route:', {
            message: error.message,
            stack: error.stack,
            address: address,
            network: network,
            chainId: chainId
        });

        // Check if it's a missing API key error or authentication error
        if (error.message.includes('API key') ||
            error.message.includes('demo') ||
            (error.message.includes('403') && error.message.includes('Forbidden')) ||
            (error.message.includes('401') && error.message.includes('Unauthorized')) ||
            error.message.includes('Must be authenticated')) {
            return res.status(500).json({
                error: 'Alchemy API key authentication failed. Please check your .env file and ensure you have a valid Alchemy API key.',
                details: error.message,
                help: 'Get a free API key from https://alchemy.com/',
                troubleshooting: 'Make sure your API key is valid and not a demo key (keys starting with -alch_)'
            });
        }

        // Also check for specific error patterns in the URL
        if (error.message.includes('eth-mainnet.g.alchemy.com/v2/demo')) {
            return res.status(500).json({
                error: 'Alchemy API key not configured. The API is using the demo endpoint which requires a valid API key.',
                details: 'Please configure your ALCHEMY_API_KEY in the .env file',
                help: 'Get a free API key from https://alchemy.com/'
            });
        }

        res.status(500).json({ error: 'Failed to fetch account data' })
    }
})

/* GET transactions */
router.get('/:address/:chain/transactions/', async function (req, res) {
    const address = req.params.address
    const chainId = req.params.chain

    // Normalize chain ID to handle both hex and decimal formats
    let normalizedChainId = chainId
    if (typeof chainId === 'string' && chainId.startsWith('0x')) {
        // Convert hex string to decimal number for lookup
        normalizedChainId = parseInt(chainId, 16)
    }

    console.log('Chain ID received:', chainId, 'Normalized to:', normalizedChainId);

    // Check if the network is supported
    const network = networksList[normalizedChainId] || networksList[chainId]

    console.log('Network determined:', network);

    if (!network) {
        return res.status(400).json({ error: 'Network not supported' })
    }

    try {
        let response = await alchemy
            .forNetwork(network)
            .core.getAssetTransfers({
                fromBlock: '0x0',
                fromAddress: address,
                excludeZeroValue: true,
                category: ['erc20'],
            })
        res.json({
            response,
        })
    } catch (error) {
        console.error('Error in transactions route:', error)

        // Check if it's an authentication error
        if (error.message.includes('API key') ||
            error.message.includes('demo') ||
            (error.message.includes('403') && error.message.includes('Forbidden')) ||
            (error.message.includes('401') && error.message.includes('Unauthorized')) ||
            error.message.includes('Must be authenticated')) {
            return res.status(500).json({
                error: 'Alchemy API key authentication failed. Please check your .env file and ensure you have a valid Alchemy API key.',
                details: error.message,
                help: 'Get a free API key from https://alchemy.com/',
                troubleshooting: 'Make sure your API key is valid and not a demo key (keys starting with -alch_)'
            });
        }

        res.status(500).json({ error: 'Failed to fetch transactions data' })
    }
})

/* GET Tokens */
router.get('/:address/:chain/tokens', async function (req, res) {
    const address = req.params.address
    const chainId = req.params.chain

    // Normalize chain ID to handle both hex and decimal formats
    let normalizedChainId = chainId
    if (typeof chainId === 'string' && chainId.startsWith('0x')) {
        // Convert hex string to decimal number for lookup
        normalizedChainId = parseInt(chainId, 16)
    }

    console.log('Chain ID received:', chainId, 'Normalized to:', normalizedChainId);

    // Check if the network is supported
    const network = networksList[normalizedChainId] || networksList[chainId]

    console.log('Network determined:', network);

    if (!network) {
        return res.status(400).json({ error: 'Network not supported' })
    }

    try {
        console.log('Fetching tokens for address:', address, 'on network:', network);
        console.log('Address validation - length:', address ? address.length : 'undefined');
        console.log('Address validation - first 10 chars:', address ? address.substring(0, 10) : 'undefined');

        // Validate the address format
        if (!address || address.length < 42) {
            return res.status(400).json({ error: 'Invalid address format' })
        }

        let response = await alchemy
            .forNetwork(network)
            .core.getTokensForOwner(address)

        console.log('Raw Alchemy response:', response);
        console.log('Response tokens count:', response.tokens ? response.tokens.length : 'No tokens');
        console.log('Response structure:', typeof response);

        // Handle case where response might not be properly formatted
        if (!response || !response.tokens) {
            console.log('No tokens property in response - returning empty array');
            return res.json([])
        }

        // Process tokens with spam filtering
        const filteredTokens = response.tokens.filter((token) => {
            return !isSpam(token.contractAddress, token.symbol)
        })

        console.log('Filtered tokens count:', filteredTokens.length);

        res.json(filteredTokens)
    } catch (error) {
        console.error('Error in tokens route:', error)
        console.error('Error stack:', error.stack)

        // Check for specific authentication errors
        if (error.message && (
            error.message.includes('Must be authenticated') ||
            error.message.includes('401') ||
            error.message.includes('403') ||
            error.message.includes('Unauthorized')
        )) {
            console.error('Authentication error in tokens route:', error.message);
            return res.status(500).json({
                error: 'Alchemy API key authentication failed',
                details: error.message,
                help: 'Please check your .env file and ensure you have a valid Alchemy API key from https://alchemy.com/'
            });
        }

        // Check for demo key errors
        if (error.message && error.message.includes('demo')) {
            console.error('Demo key detected in tokens route:', error.message);
            return res.status(500).json({
                error: 'Alchemy API key not configured properly',
                details: 'The API is using the demo endpoint which requires a valid API key',
                help: 'Please set your ALCHEMY_API_KEY in the .env file with a valid key from https://alchemy.com/'
            });
        }

        // Handle any other errors
        console.error('Other error in tokens route:', error.message);
        res.status(500).json({ error: 'Failed to fetch tokens data' })
    }
})

/* GET nfts */
router.get('/:address/:chain/nfts', async function (req, res) {
    const address = req.params.address
    const chainId = req.params.chain

    // Normalize chain ID to handle both hex and decimal formats
    let normalizedChainId = chainId
    if (typeof chainId === 'string' && chainId.startsWith('0x')) {
        // Convert hex string to decimal number for lookup
        normalizedChainId = parseInt(chainId, 16)
    }

    console.log('Chain ID received:', chainId, 'Normalized to:', normalizedChainId);

    // Check if the network is supported
    const network = networksList[normalizedChainId] || networksList[chainId]

    console.log('Network determined:', network);

    if (!network) {
        return res.status(400).json({ error: 'Network not supported' })
    }

    try {
        const response = await alchemy
            .forNetwork(network)
            .nft.getContractsForOwner(address)
        const filtered = await response.contracts.map((e) => {
            if (!e.isSpam && !isSpam(e.address, e.symbol)) {
                return {
                    name: e.name,
                    contract: e.address,
                    symbol: e.symbol,
                    tokenType: e.tokenType,
                    image: e.openSeaMetadata.imageUrl,
                    totalBalance: e.totalBalance,
                    description: e.openSeaMetadata.description,
                    slug: e.openSeaMetadata.collectionSlug,
                    floorPrice: e.openSeaMetadata.floorPrice,
                }
            }
        })
        const contracts = await filtered.filter((e) => e)
        const contractsList = await contracts.map((e) => {
            e.contract
        })
        const nftsList = await alchemy
            .forNetwork(network)
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
                                tokenBalance: nft.balance,
                                imageSmall: nft.image.thumbnailUrl,
                                imageBig: nft.image.pngUrl,
                            })
                    })
                result.push({ collection, nfts: list })
            })
            return result
        }

        res.json(await nftsByCollection())
    } catch (error) {
        console.error('Error in nfts route:', error)

        // Check if it's an authentication error
        if (error.message.includes('API key') ||
            error.message.includes('demo') ||
            (error.message.includes('403') && error.message.includes('Forbidden')) ||
            (error.message.includes('401') && error.message.includes('Unauthorized')) ||
            error.message.includes('Must be authenticated')) {
            return res.status(500).json({
                error: 'Alchemy API key authentication failed. Please check your .env file and ensure you have a valid Alchemy API key.',
                details: error.message,
                help: 'Get a free API key from https://alchemy.com/',
                troubleshooting: 'Make sure your API key is valid and not a demo key (keys starting with -alch_)'
            });
        }

        res.status(500).json({ error: 'Failed to fetch NFTs data' })
    }
})

module.exports = router
