import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material'
import Link from 'next/link'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
const axios = require('axios')

const Tokens = () => {
    const wallet = useSelector((state) => state.wallet.value)

    const [tokensList, setTokensList] = useState(null)
    const [error, setError] = useState(null)
    const [address, setAddress] = useState(wallet.address)
    const [chain, setChain] = useState(wallet.chain)

    useEffect(() => {
        setAddress(wallet.address)
        setChain(wallet.network)
        if (address && chain) {
            setError(null)
            axios
                .get(`http://localhost:3000/${address}/${chain}/tokens`)
                .then((response) => {
                    setTokensList(response.data)
                })
                .catch((error) => {
                    setError(error.message)
                })
        }
    }, [wallet])

    const tokens =
        tokensList &&
        tokensList.map((e) => {
            const title = `${e.name} ${e.contractAddress}`
            const etherscanLink = `https://etherscan.io/token/${e.contractAddress}`
            return tokensList ? (
                e.balance > 0 && (
                    <Accordion
                        className={styles.token}
                        sx={{ display: 'flex' }}
                    >
                        <AccordionSummary
                            className={styles.tokenSummary}
                            expandIcon={<ArrowDropDownIcon />}
                        >
                            <Typography sx={{ marginRight: '10px' }}>
                                {e.symbol} {e.balance}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 0 }}>
                            <Typography>{title}</Typography>
                            <Link
                                href={etherscanLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View on etherscan
                            </Link>
                        </AccordionDetails>
                    </Accordion>
                )
            ) : (
                <Typography>Token list is empty</Typography>
            )
        })

    return (
        address && (
            <Box id={styles.tokensContainer} className={styles.section}>
                <Typography
                    className={styles.boxTitle}
                    variant="h4"
                    component="h3"
                >
                    Erc20 Tokens
                </Typography>
                <Box id={styles.tokensList}>{tokens}</Box>
            </Box>
        )
    )
}

export default Tokens
