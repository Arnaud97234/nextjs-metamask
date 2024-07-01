import Head from 'next/head'
import { Inter } from 'next/font/google'
import ConnectWallet from '@/components/Wallet/ConnectWallet'
import WalletOverview from '@/components/Wallet/WalletOverview'
import Account from '@/components/Home/Account'
import Tokens from '@/components/Wallet/Tokens'
import Nfts from '@/components/Wallet/Nfts'
import { Button } from '@mui/material'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    return (
        <>
            <Head>
                <title>0x-sandbox</title>
                <meta
                    name="description"
                    content="Play with web3 development basics"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <ConnectWallet />
                <WalletOverview />
                <Account />
                <Tokens />
                <Nfts />
            </main>
        </>
    )
}
