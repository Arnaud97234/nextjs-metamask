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

const Tokens = ({ props }) => {
    const dispatch = useDispatch()
    const addTokens = (list) => {
        dispatch(addTokensToStore(list))
    }

    const tokensFromStore = useSelector((state) => state.tokens.value)
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
                fetch(`http://localhost:3000/${address}/${chain}/tokens`)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Get Erc20 from Api...')
                        addTokens(data)
                    })
            } catch (err) {
                console.log('Error :', error)
                setError(err)
            }
        }
        setTokensList(tokensFromStore.tokens)
    }, [address, chain])

    const tokens = tokensList?.map((e, key) => {
        const title = `${e.name} ${e.contractAddress}`
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
                        secondary={title}
                    ></ListItemText>
                </ListItem>
            )
        ) : (
            <Typography>Token list is empty</Typography>
        )
    })

    return (
        address && (
            <Box id={styles.tokensContainer} className={styles.section}>
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
        )
    )
}

export default Tokens
