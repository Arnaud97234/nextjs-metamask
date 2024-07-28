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

    const tokensFromStore = useSelector((state) => state.tokens.value)
    const coinsFromStore = useSelector((state) => state.coins.value)
    const [tokensList, setTokensList] = useState(tokensFromStore.tokens)
    const [error, setError] = useState(null)
    const [address, setAddress] = useState(null)
    const [chain, setChain] = useState(null)

    useEffect(() => {
        setAddress(props.address)
        setChain(props.network)
        setTokensList(tokensFromStore.tokens)
    }, [props, tokensFromStore])

    useEffect(() => {
        if (address && chain && !tokensList) {
            try {
                fetch(
                    `http://localhost:3000/account/${address}/${chain}/tokens`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Get Erc20 from Api...')
                        addTokens(data)
                    })
            } catch (err) {
                setError(err)
                console.log('Error while fetching erc20 tokens:', error)
            }
        }
        setTokensList(tokensFromStore.tokens)
    }, [address, chain])

    useEffect(() => {
        let currenciesList = []
        const countervalues = ['ETH']
        if (tokensList && !coinsFromStore.coins) {
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
            try {
                fetch(`http://localhost:3000/coins/${countervalues}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        coinsList: currenciesList,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        addCoins(data.quotes)
                    })
            } catch (error) {
                console.log('Error while fetching coins data', error)
            }
        }
    }, [tokensList])

    const [tokenCard, setTokenCard] = useState(false)
    const handleClick = (value) => {
        setTokenCard(value)
    }

    const tokens = tokensList?.map((e, key) => {
        let logo
        e?.logo
            ? (logo = e.logo)
            : (logo = 'https://res.coinpaper.com/coinpaper/RETH_hrkkkj.png')
        return tokensList ? (
            e.balance > 0 && (
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
                        primary={`${e.symbol} ${e.balance}`}
                        secondary={e.name}
                    ></ListItemText>
                </ListItem>
            )
        ) : (
            <Typography>Token list is empty</Typography>
        )
    })

    return (
        address && (
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
    )
}

export default Tokens
