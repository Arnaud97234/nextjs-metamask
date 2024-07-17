import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { addTokensToStore } from '@/reducers/tokens'

const Tokens = ({ props }) => {
    const dispatch = useDispatch()
    const addTokens = (list) => {
        dispatch(addTokensToStore(list))
    }

    const tokensFromStore = useSelector((state) => state.tokens.value)
    const [tokensList, setTokensList] = useState(tokensFromStore.tokens)
    const [error, setError] = useState(null)
    const [address, setAddress] = useState(null)
    const [chain, setChain] = useState(null)

    useEffect(() => {
        setAddress(props.address)
        setChain(props.network)
        setTokensList(tokensFromStore.tokens)
    }, [props, tokensFromStore])

    useEffect(() => {
        if (address && chain && !tokensList) {
            try {
                fetch(`http://localhost:3000/${address}/${chain}/tokens`)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Get Erc20 from Api...')
                        addTokens(data)
                    })
            } catch (err) {
                console.log('Error :', error)
                setError(err)
            }
        }
        setTokensList(tokensFromStore.tokens)
    }, [address, chain])

    const tokens = tokensList?.map((e, key) => {
        const title = `${e.name} ${e.contractAddress}`
        const etherscanLink = `https://etherscan.io/token/${e.contractAddress}`
        let logo
        e?.logo
            ? (logo = e.logo)
            : (logo = 'https://static.alchemyapi.io/images/assets/5864.png')

        console.log(logo)
        return tokensList ? (
            e.balance > 0 && (
                <Accordion
                    className={styles.token}
                    sx={{ display: 'flex' }}
                    key={key}
                >
                    <AccordionSummary
                        className={styles.tokenSummary}
                        expandIcon={<ArrowDropDownIcon />}
                    >
                        <Image src={logo} width={20} height={20} />
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
