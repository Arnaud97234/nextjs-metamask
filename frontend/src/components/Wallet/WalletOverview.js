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
                    <Typography color="blue">MAINNET</Typography>
                )}
            </Box>
        </Box>
    ) : (
        <Typography variant="h6">Wallet signin to continue ...</Typography>
    )
}

export default WalletOverview
