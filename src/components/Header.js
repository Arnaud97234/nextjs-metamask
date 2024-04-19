'use-client'
import { useSDK } from '@metamask/sdk-react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useState, useEffect } from 'react'
import { MetaMaskProvider } from "@metamask/sdk-react"
import { formatBalance } from '../utils'

const ConnectWalletButton = () => {
    const [account, setAccount] = useState(null)
    const [network, setNetwork] = useState(null)
    const [balance, setBalance] = useState(null)
    const [hasProvider, setHasProvider] = useState(null)
    const { sdk, connected, connecting, provider, chainId } = useSDK()

    const connect = async () => {
        try {
            const connect =  await sdk?.connect()
            setAccount(connect?.[0])

        } catch (err) {
            sdk.terminate()
        }
    }

    const disconnect = () => {
        if (sdk) {
            sdk.terminate()
            setAccount(null)
            setNetwork(null)
            setBalance(null)
        }
    }

    useEffect(() => {
        if (account) {
            setNetwork(chainId)
        } else {
            setNetwork(null)
        }
    }, [account, network])

    useEffect(() => {
        const getBalance = async () => {
           let balance = formatBalance(await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest']
            }))
            setBalance(balance)
        }
        getBalance()
        !account && setBalance(null)
    
    }, [account, network])

    const updateAccount = async () => {
        const address = await window.ethereum.request({ method: 'eth_accounts' })
        setAccount(address[0])
    }

    const updateChain = async () => {
        const chain = await window.ethereum.request({
            method: 'eth_chainId',
          })
        setNetwork(chain)
        await updateAccount()
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
    }, [updateAccount, updateChain])


    console.log("Chain: ", network, "Account: ", account, "Balance: ", balance, "provider: ", Boolean(provider), "Connected: ", connected)

    return (
        <>
        <Box>
            {account ? (
                <Button variant='outlined' onClick={disconnect}>
                    Disconnect
                </Button>
            ) : (
                <Button disabled={connecting} variant='contained' onClick={connect}>
                    Connect wallet
                </Button>
            )}
        </Box>
        Address: {account} - Chain: {network} - Balance: {balance}
        </>
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