import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeWalletFromStore } from '../reducers/wallet'
import { Box, Typography } from '@mui/material'

const axios = require('axios')

const WalletOverview = () => {
    const dispatch = useDispatch()

    const clearStore = () => {
        dispatch(removeWalletFromStore())
    }

    const [connectedAddress, setConnectedAddress] = useState(null)
    const [connectedNetwork, setConnectedNetwork] = useState(null)

    const wallet = useSelector((state) => state.wallet.value)
    useEffect(() => {
        setConnectedAddress(wallet.address)
        setConnectedNetwork(wallet.network)
    }, [wallet])

    const [account, setAccount] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (connectedAddress && connectedNetwork) {
            setError(null)
            axios
                .get(
                    `http://localhost:3000/${connectedAddress}/${connectedNetwork}`
                )
                .then((response) => {
                    setAccount(response.data)
                })
                .catch((error) => {
                    setError(error.response)
                    console.log(error)
                })
        }
    }, [connectedAddress, connectedNetwork])

    const ErrorContent = () => {
        return <Typography style={{ color: 'red' }}>{error}</Typography>
    }

    const AccountDetails = () => {
        return (
            connectedAddress &&
            account && (
                <Box id={styles.accountBox} className={styles.leftBox}>
                    {account.ens && <Typography>Ens: {account.ens}</Typography>}
                    <Typography>Balance: {account.nativeBalance} Ξ</Typography>
                    <Typography>BlockHeight: {account.blockHeight}</Typography>
                </Box>
            )
        )
    }

    return connectedNetwork && (error ? <ErrorContent /> : <AccountDetails />)
}

export default WalletOverview
