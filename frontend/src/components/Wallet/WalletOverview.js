import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'

const WalletOverview = () => {
    const wallet = useSelector((state) => state.wallet.value)
    const address = wallet.address
    const network = wallet.network

    return address ? (
        <Box id="walletOverviewContainer">
            <Typography id="walletTitle">
                {address} on {network}
            </Typography>
            <Box>
                <Typography>{wallet.balance}</Typography>
                {network === '0x1' && (
                    <Typography color="orange">MAINNET</Typography>
                )}
            </Box>
        </Box>
    ) : (
        <Typography variant="h6">Connect wallet to continue ...</Typography>
    )
}

export default WalletOverview
