import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@mui/material'
import { addTokensToStore } from '@/reducers/tokens'
import { addCoinsToStore } from '@/reducers/coins'
import TokenCard from '@/components/Tokens/TokenCard'

const Tokens = ({ props }) => {
    const dispatch = useDispatch()
    const addTokens = (list) => {
        dispatch(addTokensToStore(list))
    }
    const addCoins = (list) => {
        dispatch(addCoinsToStore(list))
    }

    // Move all useSelector calls to the top level of component
    const tokensFromStore = useSelector((state) => state.tokens.value)
    const coinsFromStore = useSelector((state) => state.coins.value)
    const walletFromRedux = useSelector((state) => state.wallet.value)

    const [tokensList, setTokensList] = useState(tokensFromStore.tokens || [])
    const [error, setError] = useState(null)
    const [address, setAddress] = useState(null)
    const [chain, setChain] = useState(null)

    // Properly extract address and network from props
    useEffect(() => {
        // Handle different prop structures - the wallet object or individual props
        let addressToUse = null;
        let chainToUse = null;

        if (props && props.address) {
            // Props are individual values
            addressToUse = props.address;
            chainToUse = props.network || '0x1';
        } else if (props && props.value && props.value.address) {
            // Props is the full wallet object
            addressToUse = props.value.address;
            chainToUse = props.value.network || '0x1';
        } else if (props && typeof props === 'object' && props.address) {
            // Props are an object with address property (fallback)
            addressToUse = props.address;
            chainToUse = props.network || '0x1';
        } else {
            // If no props, check if we have wallet data from Redux
            if (walletFromRedux && walletFromRedux.address) {
                addressToUse = walletFromRedux.address;
                chainToUse = walletFromRedux.network || '0x1';
            }
        }

        if (addressToUse) {
            setAddress(addressToUse)
            setChain(chainToUse)
        }
        setTokensList(tokensFromStore.tokens || [])
    }, [props, tokensFromStore, walletFromRedux])

    useEffect(() => {
        if (address && chain) {
            // Add proper error handling for the fetch call
            fetch(
                `http://localhost:3000/account/${address}/${chain}/tokens`
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    return response.json()
                })
                .then((data) => {
                    // Check if data is an error object and handle appropriately
                    if (data && typeof data === 'object' && data.error) {
                        setError(data.error);
                        setTokensList([]); // Set empty array to avoid infinite loading
                        return;
                    }

                    // Handle case where API returns an empty array vs. object with empty tokens
                    if (Array.isArray(data)) {
                        addTokens(data)
                        setTokensList(data) // Update local state - ensure it's an array
                    } else if (data && typeof data === 'object' && data.tokens) {
                        addTokens(data.tokens)
                        setTokensList(data.tokens) // Update local state - ensure it's an array
                    } else {
                        setTokensList([]); // Set empty array for unknown format
                    }
                })
                .catch((err) => {
                    setError(err)
                    // Set an empty array to avoid infinite loading
                    setTokensList([])
                })
        }
    }, [address, chain])

    useEffect(() => {
        let currenciesList = []
        const countervalues = ['ETH']
        if (tokensList && !coinsFromStore.coins && tokensList.length > 0) {
            tokensList.map((e) => {
                const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/
                if (!regex.test(e.symbol)) {
                    e.balance > 0 &&
                        currenciesList.push({
                            symbol: e.symbol.toUpperCase(),
                            name: e.name,
                            contract: e.contractAddress,
                        })
                }
            })
            if (currenciesList.length > 0) { // Only fetch if we have tokens to process
                console.log('Fetching coin data for:', currenciesList)
                // Try to fetch coin data but handle the case where API key is missing
                fetch(`http://localhost:3000/coins/${countervalues}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        coinsList: currenciesList,
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        addCoins(data.quotes)
                    })
                    .catch((error) => {
                        console.warn('Coin data fetch failed (likely missing API key):', error.message);
                        // Continue without coin data instead of crashing
                        // This prevents the component from failing completely when API key is missing
                    })
            }
        }
    }, [tokensList])

    const [tokenCard, setTokenCard] = useState(false)
    const handleClick = (value) => {
        setTokenCard(value)
    }

    // Handle case where no tokens exist
    if (!address) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box id={styles.tokensBox} className={styles.section}>
                    <Typography
                        className={styles.boxTitle}
                        variant="h4"
                        component="h3"
                    >
                        Erc20 Tokens
                    </Typography>
                    <Typography>No wallet connected</Typography>
                </Box>
            </Box>
        )
    }

    // Show error state if we have an error
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box id={styles.tokensBox} className={styles.section}>
                    <Typography
                        className={styles.boxTitle}
                        variant="h4"
                        component="h3"
                    >
                        Erc20 Tokens
                    </Typography>
                    <Typography color="error">
                        Error loading tokens: {typeof error === 'string' ? error : JSON.stringify(error)}
                    </Typography>
                </Box>
            </Box>
        )
    }

    // Show loading state or empty state
    if (!tokensList) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box id={styles.tokensBox} className={styles.section}>
                    <Typography
                        className={styles.boxTitle}
                        variant="h4"
                        component="h3"
                    >
                        Erc20 Tokens
                    </Typography>
                    <Typography>Loading tokens...</Typography>
                </Box>
            </Box>
        )
    }

    const tokens = tokensList?.length > 0 ? (
        tokensList.map((e, key) => {
            // Make sure we're not rendering undefined or null values
            if (!e || typeof e !== 'object') {
                return null;
            }
            let logo
            e?.logo
                ? (logo = e.logo)
                : (logo = 'https://res.coinpaper.com/coinpaper/RETH_hrkkkj.png')
            return e.balance > 0 && (
                <ListItem
                    className={styles.token}
                    sx={{ display: 'flex' }}
                    key={key}
                    onClick={() => handleClick(e)}
                >
                    <ListItemAvatar>
                        <Avatar
                            alt={e.name}
                            src={logo}
                            className={styles.itemIcon}
                        ></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${e.symbol || 'Unknown'} ${e.balance || 0}`}
                        secondary={e.name || 'Unknown'}
                    ></ListItemText>
                </ListItem>
            )
        })
    ) : (
        <Typography>No ERC20 tokens found</Typography>
    )

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box id={styles.tokensBox} className={styles.section}>
                <Typography
                    className={styles.boxTitle}
                    variant="h4"
                    component="h3"
                >
                    Erc20 Tokens
                </Typography>
                <List dense={true} id={styles.tokensList}>
                    {tokens}
                </List>
            </Box>
            {tokenCard && <TokenCard props={tokenCard} />}
        </Box>
    )
}

export default Tokens