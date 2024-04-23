import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteFromStore } from '../../reducers/wallet'
import { Button, Box, Typography } from '@mui/material'

const axios = require('axios')

const WalletOverview = () => {
    const dispatch = useDispatch()

    const clearStore = () => {
        dispatch(deleteFromStore())
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
                    setError(error.response.data.error)
                })
        }
    }, [connectedAddress, connectedNetwork])

    const ErrorContent = () => {
        return <Typography>{error}</Typography>
    }

    const AccountDetails = () => {
        return (
            connectedAddress &&
            account && (
                <Box>
                    <Typography>ACCOUNT INFOS:</Typography>
                    <Typography>Address: {connectedAddress}</Typography>
                    {account.ens && <Typography>Ens: {account.ens}</Typography>}
                    <Typography>Network: {account.network}</Typography>
                    <Typography>Balance: {account.nativeBalance} Ξ</Typography>
                    <Typography>BlockHeight: {account.blockHeight}</Typography>
                </Box>
            )
        )
    }

    return connectedNetwork && (error ? <ErrorContent /> : <AccountDetails />)
}

export default WalletOverview
