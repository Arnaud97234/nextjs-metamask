'use client'
import { Box, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
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
import { removeCoinsFromStore } from '@/reducers/coins'

// Simple wrapper for MetaMask SDK that avoids direct use of useSDK hook
const ConnectWalletButton = () => {
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
        dispatch(removeCoinsFromStore())
    }

    const wallet = useSelector((state) => state.wallet.value)
    const [connecting, setConnecting] = useState(false)

    // Connect metamask - use a more direct approach
    const connect = async () => {
        try {
            setConnecting(true);

            // Check if we're in browser environment
            if (typeof window === 'undefined') {
                return;
            }

            // Direct Ethereum provider check
            if (!window.ethereum) {
                return;
            }

            // Try to get accounts - this is safer than using SDK directly
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                addAddress(accounts[0]);
                // Also get chain info when connecting
                try {
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    addChain(chainId);
                } catch (chainErr) {
                    // Silently ignore chain ID errors - not critical for functionality
                }
            } else {
                // Request account access
                const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (newAccounts.length > 0) {
                    addAddress(newAccounts[0]);
                    // Also get chain info when connecting
                    try {
                        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                        addChain(chainId);
                    } catch (chainErr) {
                        // Silently ignore chain ID errors - not critical for functionality
                    }
                }
            }
        } catch (err) {
            // Error is handled by UI state, no need to log here
        } finally {
            setConnecting(false);
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && wallet.address) {
            const getBalance = async () => {
                try {
                    if (window.ethereum) {
                        let balance = formatBalance(
                            await window.ethereum.request({
                                method: 'eth_getBalance',
                                params: [wallet.address, 'latest'],
                            })
                        )
                        addBalance(balance)
                    }
                } catch (err) {
                    addBalance(null)
                }
            }
            getBalance()
        } else {
            addBalance(null)
        }
    }, [wallet.address, wallet.network])

    // Connected account or chain change
    const updateAccount = async () => {
        try {
            if (typeof window !== 'undefined' && window.ethereum) {
                const address = await window.ethereum.request({
                    method: 'eth_accounts',
                })
                addAddress(address[0])
            }
        } catch (err) {
            // Error handling for account updates
        }
    }

    const updateChain = async () => {
        try {
            if (typeof window !== 'undefined' && window.ethereum) {
                const chain = await window.ethereum.request({
                    method: 'eth_chainId',
                })
                addChain(chain)
            }
        } catch (err) {
            // Error handling for chain updates
        }
    }

    useEffect(() => {
        // Check if we're in a browser environment and have proper Ethereum provider
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                // Set up event listeners with proper error handling
                window.ethereum.on('accountsChanged', updateAccount)
                window.ethereum.on('chainChanged', updateChain)

                return () => {
                    // Safely clean up listeners with proper error handling
                    try {
                        if (window.ethereum?.removeListener) {
                            window.ethereum.removeListener('accountsChanged', updateAccount)
                            window.ethereum.removeListener('chainChanged', updateChain)
                        }
                    } catch (err) {
                        // Silently ignore cleanup errors - not critical for functionality
                    }
                }
            } catch (err) {
                // Error handling for event listener setup
            }
        }
    }, [])

    // Disconnect wallet
    const disconnect = () => {
        try {
            clearStore()
        } catch (err) {
            // Silently handle disconnect errors - store will be cleared anyway
            clearStore()
        }
    }

    return (
        <Box sx={{ alignSelf: 'center', marginBottom: '14px' }}>
            {wallet.address ? (
                <Button
                    variant="outlined"
                    onClick={disconnect}
                    sx={{
                        paddingTop: '11px',
                        color: 'orange',
                        border: 'solid 1px orange',
                    }}
                >
                    Disconnect
                </Button>
            ) : (
                <Button
                    disabled={connecting}
                    variant="contained"
                    onClick={connect}
                    sx={{ paddingTop: '11px', backgroundColor: 'orange' }}
                >
                    Connect wallet
                </Button>
            )}
        </Box>
    )
}

const ConnectWallet = () => {
    // Metamask init - make sure we're in browser environment
    const host =
        typeof window !== 'undefined'
            ? window.location.host
            : 'http://localhost:3001'

    return (
        <ConnectWalletButton />
    )
}

export default ConnectWallet
