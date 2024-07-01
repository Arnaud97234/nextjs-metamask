import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
const axios = require('axios')

const WalletOverview = () => {
    const wallet = useSelector((state) => state.wallet.value)
    const address = wallet.address
    const network = wallet.network

    return address ? (
        <>
            <Typography id="title" variant="h6" component="h3">
                Connected with {address} on {network}
            </Typography>
            <Box>
                <Typography>{wallet.balance}</Typography>
                {network === '0x1' && (
                    <Typography color="blue">MAINNET</Typography>
                )}
            </Box>
        </>
    ) : (
        <Typography variant="h6">Wallet signin to continue ...</Typography>
    )
}

export default WalletOverview
