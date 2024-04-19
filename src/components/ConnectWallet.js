'use-client'
import { useSDK } from '@metamask/sdk-react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useState, useEffect } from 'react'
import { MetaMaskProvider } from "@metamask/sdk-react"
import { formatBalance } from '../utils'
import WalletOverview from './WalletOverview'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

import { useDispatch, useSelector } from 'react-redux'
import { addAddressToStore, addChainToStore, addBalanceToStore } from '@/reducers/wallet'

const ConnectWalletButton = () => {
    const { sdk, connected, connecting, provider, chainId } = useSDK()

    const dispatch = useDispatch()
    const addAddress = (address) => {
        dispatch(addAddressToStore(address))
    }
    const addChain = (chain) => {
        dispatch(addChainToStore(chain))
    }
    const addBalance = (amount) => {
        dispatch(addBalanceToStore(amount))
    }

    const wallet = useSelector((state) => state.wallet.value)

    // Connect metamask
    const connect = async () => {
        try {
            const connect =  await sdk?.connect()
            addAddress(connect?.[0])
            setOpen(false)
        } catch (err) {
            sdk.terminate()
        }
    }

    useEffect(() => {
        const chain = chainId
        if(wallet.address) {
            addChain(chain)
        }
        else addChain(null)
    }, [wallet.address, wallet.network])

    useEffect(() => {
        if(wallet.address) {
            const getBalance = async () => {
            let balance = formatBalance(await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [wallet.address, 'latest']
                }))
                addBalance(balance)
            }
            getBalance()
        } else addBalance(null)
    }, [wallet.address, wallet.network])

    // Connected account or chain change
    const updateAccount = async () => {
        const address = await window.ethereum.request({ method: 'eth_accounts' })
        addAddress(address[0])
    }

    const updateChain = async () => {
        const chain = await window.ethereum.request({
            method: 'eth_chainId',
          })
        addChain(chain)
        // await updateAccount()
    }

    useEffect(() => {
        window.ethereum.on('accountsChanged', updateAccount)
        window.ethereum.on('chainChanged', updateChain)
        return () => {
            window.ethereum?.removeListener('accountsChanged', updateAccount)
            window.ethereum?.removeListener(
              'chainChanged',
              updateChain,
            )
          }
    }, [wallet])

    // Account details modal
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <Box>
            {wallet.address ? (
                <>
                    <Button variant='outlined' onClick={handleOpen}>
                        Wallet
                    </Button>
                    <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <WalletOverview />
                    </Modal>
                </>
            ) : (
                <Button disabled={connecting} variant='contained' onClick={connect}>
                    Connect wallet
                </Button>
            )}
        </Box>
    )
}

const ConnectWallet = () => {
      // Metamask init
    const host = typeof window !== "undefined" ? window.location.host : "http://localhost:3001"
    const sdkOptions = {
        logging: { developerMode: false },
        checkInstallationImmediately: false,
        dappMetadata: {
        name: "0x-wallet",
        url: host
        }
    }

    return (
        <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
            <ConnectWalletButton />
        </MetaMaskProvider>
    )
}

export default ConnectWallet