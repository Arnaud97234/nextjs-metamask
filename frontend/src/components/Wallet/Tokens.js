import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
const axios = require('axios')

const Tokens = () => {
    const wallet = useSelector((state) => state.wallet.value)

    const [tokensList, setTokensList] = useState(null)
    const [error, setError] = useState(null)
    const [address, setAddress] = useState(wallet.address)
    const [chain, setChain] = useState(wallet.chain)

    useEffect(() => {
        setAddress(wallet.address)
        setChain(wallet.network)
        if (address && chain) {
            setError(null)
            axios
                .get(`http://localhost:3000/${address}/${chain}/tokens`)
                .then((response) => {
                    setTokensList(response.data.response.tokens)
                })
                .catch((error) => {
                    setError(error.message)
                })
        }
    }, [wallet])

    const tokens =
        tokensList &&
        tokensList.map((e) => {
            return tokensList ? (
                <>
                    <Typography>{e.name}</Typography>
                    <Typography>{e.balance}</Typography>
                </>
            ) : (
                <Typography>Token list is empty</Typography>
            )
        })

    return (
        wallet && (
            <>
                <Typography className="title" variant="h6" component="h3">
                    Erc20 Tokens
                </Typography>
                <Box>{tokens}</Box>
            </>
        )
    )
}

export default Tokens
