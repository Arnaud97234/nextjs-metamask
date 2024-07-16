import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Card,
    CardMedia,
    ListItemButton,
    ListItemText,
    ListItemIcon,
} from '@mui/material'
import Link from 'next/link'
import { addNftsToStore } from '@/reducers/nfts'
import { useSelector, useDispatch } from 'react-redux'
const axios = require('axios')

const Nfts = () => {
    const wallet = useSelector((state) => state.wallet.value)
    const [nftsList, setNftsList] = useState(null)
    const [error, setError] = useState(null)
    const [address, setAddress] = useState(wallet.address)
    const [chain, setChain] = useState(wallet.chain)

    const dispatch = useDispatch()
    const addNfts = (nfts) => {
        dispatch(addNftsToStore(nfts))
    }

    useEffect(() => {
        setAddress(wallet.address)
        setChain(wallet.network)
        // if (address && chain) {
        !nftsList &&
            axios
                .get(`http://localhost:3000/${address}/${chain}/nfts`)
                .then((response) => {
                    console.log('FETCH DATA FROM API')
                    addNfts(response.data)
                    setNftsList(response.data)
                })
                .catch((error) => {
                    setError(error.message)
                    console.log(error)
                })
        // }
    }, [wallet])

    const [openCollection, setOpenCollection] = useState(false)

    const nfts =
        nftsList &&
        nftsList.map((e) => {
            let list = []
            let index = nftsList.indexOf(e)
            e.nfts.map((nft, key) => {
                let listItemText = `${nft.name} - ${nft.tokenId}`
                list.push(
                    <span className={styles.nft}>
                        <ListItemButton key={key}></ListItemButton>
                        <ListItemText primary={listItemText} />
                    </span>
                )
            })

            const nftsCount = `${list.length} items`
            const collectionLink = `https://opensea.io/collection/${e.collection.slug}`
            const desc = e.collection.description
            const collectionDesc = desc && desc.substring(0, 256)

            return nftsList ? (
                <Card className={styles.collection}>
                    <Typography className={styles.collectionName}>
                        {e.collection.name}
                    </Typography>
                    <span className={styles.collectionIntro}>
                        <CardMedia
                            sx={{
                                width: '75px',
                                height: '75px',
                                minWidth: '75px',
                                margin: '0 10px 10px 0',
                            }}
                            image={e.collection.image}
                        ></CardMedia>
                        <Typography sx={{ textOverflow: 'ellipsis' }}>
                            {collectionDesc}
                        </Typography>
                    </span>
                    <Box className={styles.collectionDetails}>
                        <Box className={styles.collectionDropdown}>
                            <ListItemButton
                                className={styles.itemButton}
                                alignItems="flex-start"
                                onClick={() => {
                                    openCollection === index
                                        ? setOpenCollection(false)
                                        : setOpenCollection(index)
                                }}
                                sx={{
                                    '&:hover, &:focus': {
                                        '& svg': {
                                            opacity: openCollection ? 1 : 0,
                                        },
                                    },
                                }}
                            >
                                <ListItemText primary={nftsCount} />
                                {openCollection === nftsList.indexOf(e) && (
                                    <Box className={styles.itemText}>
                                        <Typography>
                                            Collection address:{' '}
                                            {e.collection.contract}
                                        </Typography>
                                        <Typography>
                                            {e.collection.tokenType}
                                        </Typography>
                                        <Link
                                            href={collectionLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View on Opensea
                                        </Link>
                                        <Box className={styles.nftsList}>
                                            {list}
                                        </Box>
                                    </Box>
                                )}
                            </ListItemButton>
                        </Box>
                    </Box>
                </Card>
            ) : (
                <Typography>NFT list is empty</Typography>
            )
        })

    return (
        address &&
        nfts && (
            <Box id={styles.nftsByCollectionContainer}>
                <Typography
                    className={styles.boxTitle}
                    variant="h4"
                    component="h3"
                >
                    NFTs
                </Typography>
                <Box id={styles.collectionsList}>{nfts}</Box>
            </Box>
        )
    )
}

export default Nfts
