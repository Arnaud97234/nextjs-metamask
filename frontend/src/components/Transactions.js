import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { addTransactionsToStore } from '@/reducers/transactions'

const Transactions = ({ props }) => {
    const dispatch = useDispatch()
    const addTransactions = (list) => {
        dispatch(addTransactionsToStore(list))
    }

    // Safely access the transactions store value with fallback
    const transactionsFromStore = useSelector((state) => state.transactions?.value || { transactions: null })
    const [transactionsList, setTransactionsList] = useState(transactionsFromStore?.transactions || [])
    const [address, setAddress] = useState(null)
    const [chain, setChain] = useState(null)
    const [network, setNetwork] = useState('ethereum') // Default to Ethereum mainnet
    const [error, setError] = useState(null)

    // Properly extract address and network from props
    useEffect(() => {
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
        }

        if (addressToUse) {
            setAddress(addressToUse)
            setChain(chainToUse)
            // Determine network for Etherscan links
            let networkName = 'ethereum' // default to mainnet
            if (chainToUse === '0x89' || chainToUse === 137) {
                networkName = 'polygon'
            } else if (chainToUse === '0xa4b1' || chainToUse === 42161) {
                networkName = 'arbitrum'
            } else if (chainToUse === '0xaa36a7' || chainToUse === 11155111) {
                networkName = 'sepolia'
            }
            setNetwork(networkName)
        }
        setTransactionsList(transactionsFromStore?.transactions || [])
    }, [props, transactionsFromStore])

    useEffect(() => {
        if (address && chain) {
            try {
                fetch(`http://localhost:3000/account/${address}/${chain}/transactions`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`)
                        }
                        return response.json()
                    })
                    .then((data) => {
                        // Handle different data structures that might come from API
                        let transactionsData = null;
                        if (data && data.response && data.response.transfers) {
                            transactionsData = data.response.transfers;
                        } else if (data && data.response) {
                            transactionsData = data.response;
                        } else if (Array.isArray(data)) {
                            transactionsData = data;
                        } else {
                            transactionsData = [];
                        }

                        addTransactions(transactionsData)
                        setTransactionsList(transactionsData)
                    })
                    .catch((err) => {
                        setError(err)
                        setTransactionsList([]) // Set empty array to avoid infinite loading
                    })
            } catch (err) {
                setError(err)
                setTransactionsList([])
            }
        }
    }, [address, chain])

    // Handle case where no address is provided
    if (!address) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box id={styles.transactionsBox} className={styles.section}>
                    <Typography
                        className={styles.boxTitle}
                        variant="h4"
                        component="h3"
                    >
                        Transactions
                    </Typography>
                    <Typography>No wallet connected</Typography>
                </Box>
            </Box>
        )
    }

    // Handle case where we have an error
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box id={styles.transactionsBox} className={styles.section}>
                    <Typography
                        className={styles.boxTitle}
                        variant="h4"
                        component="h3"
                    >
                        Transactions
                    </Typography>
                    <Typography color="error">
                        Error loading transactions: {typeof error === 'string' ? error : JSON.stringify(error)}
                    </Typography>
                </Box>
            </Box>
        )
    }

    // Show loading state or empty state
    if (!transactionsList && transactionsList !== []) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box id={styles.transactionsBox} className={styles.section}>
                    <Typography
                        className={styles.boxTitle}
                        variant="h4"
                        component="h3"
                    >
                        Transactions
                    </Typography>
                    <Typography>Loading transactions...</Typography>
                </Box>
            </Box>
        )
    }

    const transactions = Array.isArray(transactionsList) && transactionsList.length > 0 ? (
        transactionsList.map((transaction, key) => {
            // Make sure we're not rendering undefined or null values
            if (!transaction || typeof transaction !== 'object') {
                return null;
            }

            // Extract relevant information from the transaction
            let amount = '0.000000 ETH'
            if (transaction.value) {
                const ethValue = Number(transaction.value) / 1e18;
                amount = `${ethValue.toFixed(6)} ETH`;
            }
            const fromAddress = transaction.from || 'Unknown'
            const toAddress = transaction.to || 'Unknown'
            const hash = transaction.hash || 'Unknown'

            // Determine if it's incoming or outgoing transaction
            let direction = 'OUT';
            if (transaction.from && address && transaction.from.toLowerCase() === address.toLowerCase()) {
                direction = 'OUT';
            } else if (transaction.to && address && transaction.to.toLowerCase() === address.toLowerCase()) {
                direction = 'IN';
            }

            return (
                <ListItem
                    className={styles.transaction}
                    sx={{ display: 'flex' }}
                    key={key}
                >
                    <ListItemAvatar>
                        <Avatar
                            alt="Transaction"
                            src="/static/images/avatar/1.jpg"
                            className={styles.itemIcon}
                        ></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${amount} ${direction}`}
                        secondary={
                            <a
                                href={`https://${network}.etherscan.io/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'inherit', textDecoration: 'none' }}
                            >
                                {hash.substring(0, 12)}...
                            </a>
                        }
                    ></ListItemText>
                </ListItem>
            )
        })
    ) : (
        <Typography>No transactions found</Typography>
    )

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box id={styles.transactionsBox} className={styles.section}>
                <Typography
                    className={styles.boxTitle}
                    variant="h4"
                    component="h3"
                >
                    Transactions
                </Typography>
                <List dense={true} id={styles.transactionsList}>
                    {transactions}
                </List>
            </Box>
        </Box>
    )
}

export default Transactions