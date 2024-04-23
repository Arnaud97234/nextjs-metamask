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
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Wallet connected:
            </Typography>
            <Box>
                <Typography>{wallet.address}</Typography>
                <Typography>{wallet.network}</Typography>
                <Typography>{wallet.balance}</Typography>
            </Box>
        </>
    ) : (
        <Typography variant="h6">Wallet signin to continue ...</Typography>
    )
}

export default WalletOverview
