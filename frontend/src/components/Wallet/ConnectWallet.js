'use-client'
import { useSDK } from '@metamask/sdk-react'
import { Box, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { MetaMaskProvider } from '@metamask/sdk-react'
import { formatBalance } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import {
    addAddressToStore,
    addChainToStore,
    addBalanceToStore,
    removeWalletFromStore,
} from '@/reducers/wallet'
import { removeNftsFromStore } from '@/reducers/nfts'
import { removeTokensFromStore } from '@/reducers/tokens'

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
    const clearStore = () => {
        dispatch(removeWalletFromStore())
        dispatch(removeNftsFromStore())
        dispatch(removeTokensFromStore())
    }

    const wallet = useSelector((state) => state.wallet.value)

    // Connect metamask
    const connect = async () => {
        try {
            const connect = await sdk?.connect()
            addAddress(connect?.[0])
            setOpen(false)
        } catch (err) {
            sdk.terminate()
        }
    }

    useEffect(() => {
        updateChain()
        dispatch(removeNftsFromStore())
        dispatch(removeTokensFromStore())
    }, [wallet.address, chainId])

    useEffect(() => {
        if (wallet.address) {
            const getBalance = async () => {
                let balance = formatBalance(
                    await window.ethereum.request({
                        method: 'eth_getBalance',
                        params: [wallet.address, 'latest'],
                    })
                )
                addBalance(balance)
            }
            getBalance()
        } else addBalance(null)
    }, [wallet.address, wallet.network])

    // Connected account or chain change
    const updateAccount = async () => {
        if (window.ethereum) {
            try {
                const address = await window.ethereum.request({
                    method: 'eth_accounts',
                })
                addAddress(address[0])
            } catch (err) {
                return { error: err.message }
            }
        }
    }

    const updateChain = async () => {
        if (window.ethereum) {
            try {
                const chain = await window.ethereum.request({
                    method: 'eth_chainId',
                })
                addChain(chain)
                // await updateAccount()
            } catch (err) {
                return { error: err.message }
            }
        }
    }

    useEffect(() => {
        if (window.ethereum) {
            try {
                window.ethereum.on('accountsChanged', updateAccount)
                window.ethereum.on('chainChanged', updateChain)
                return () => {
                    window.ethereum?.removeListener(
                        'accountsChanged',
                        updateAccount
                    )
                    window.ethereum?.removeListener('chainChanged', updateChain)
                }
            } catch (err) {
                return { error: err.message }
            }
        }
    }, [wallet])

    // Disconnect wallet
    const disconnect = () => {
        if (sdk) {
            sdk.terminate()
            clearStore()
        }
    }

    return (
        <Box>
            {wallet.address ? (
                <Button variant="outlined" onClick={disconnect}>
                    Disconnect
                </Button>
            ) : (
                <Button
                    disabled={connecting}
                    variant="contained"
                    onClick={connect}
                >
                    Connect wallet
                </Button>
            )}
        </Box>
    )
}

const ConnectWallet = () => {
    // Metamask init
    const host =
        typeof window !== 'undefined'
            ? window.location.host
            : 'http://localhost:3001'
    const sdkOptions = {
        logging: { developerMode: false },
        checkInstallationImmediately: false,
        dappMetadata: {
            name: '0x-sandbox',
            url: host,
        },
    }

    return (
        <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
            <ConnectWalletButton />
        </MetaMaskProvider>
    )
}

export default ConnectWallet
