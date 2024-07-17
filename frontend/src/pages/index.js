import styles from '../styles/Home.module.css'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import ConnectWallet from '@/components/Wallet/ConnectWallet'
import WalletOverview from '@/components/Wallet/WalletOverview'
import Account from '@/components/Account'
import Tokens from '@/components/Tokens'
import Nfts from '@/components/Nfts'
import { Container, Box, Tab, ZIndex, Opacity } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [tabValue, setTabValue] = useState('1')
    const wallet = useSelector((state) => state.wallet.value)

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue)
    }

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
            <main className={styles.main}>
                <Container id={styles.accountInfo} className={styles.container}>
                    <Box className={styles.leftBox}>
                        <ConnectWallet />
                        <WalletOverview />
                    </Box>
                    <Account />
                </Container>
                <Container
                    id={styles.accountAssets}
                    className={styles.container}
                >
                    <TabContext value={tabValue}>
                        <TabList
                            onChange={handleChangeTab}
                            sx={{
                                position: 'sticky',
                                top: '0',
                                zIndex: '1',
                                backgroundColor: 'white',
                                opacity: 0.9,
                            }}
                        >
                            <Tab label="Erc20 tokens" value="1" />
                            <Tab label="NFTs" value="2" />
                            <Tab label="Transactions" value="3" />
                        </TabList>
                        <TabPanel className={styles.tabPanel} value="1">
                            <Tokens props={wallet} />
                        </TabPanel>
                        <TabPanel className={styles.tabPanel} value="2">
                            <Nfts props={wallet} />
                        </TabPanel>
                        <TabPanel
                            className={styles.tabPanel}
                            value="3"
                        ></TabPanel>
                    </TabContext>
                </Container>
            </main>
        </>
    )
}
