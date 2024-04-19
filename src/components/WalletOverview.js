import { useSDK } from '@metamask/sdk-react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteFromStore } from '@/reducers/wallet'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'


const WalletOverview = () => {

    const { sdk } = useSDK()
    const dispatch = useDispatch()

    const clearStore = () => {
        dispatch(deleteFromStore())
    }

    const disconnect = () => {
        if (sdk) {
            sdk.terminate()
            clearStore()
        }
    }

    const wallet = useSelector((state) => state.wallet.value)

    return (
        <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Account details
            </Typography>
            <Box>
                <Typography>{wallet.address}</Typography>
                <Typography>{wallet.network}</Typography>
                <Typography>{wallet.balance}</Typography>
            </Box>
            <Button onClick={disconnect}>Disconnect</Button>
        </>
    )
}

export default WalletOverview