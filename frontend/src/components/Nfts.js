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

const Nfts = ({ props }) => {
    const dispatch = useDispatch()
    const addNfts = (list) => {
        dispatch(addNftsToStore(list))
    }
    const nftsFromStore = useSelector((state) => state.nfts.value)
    const [nftsList, setNftsList] = useState(nftsFromStore.nfts)
    const [address, setAddress] = useState(null)
    const [chain, setChain] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        setAddress(props.address)
        setChain(props.network)
        setNftsList(nftsFromStore.nfts)
    }, [props, nftsFromStore])

    useEffect(() => {
        if (address && chain && !nftsList) {
            try {
                fetch(`http://localhost:3000/${address}/${chain}/nfts`)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Get Nfts from Api...')
                        addNfts(data)
                    })
            } catch (err) {
                console.log('Error :', error)
                setError(err)
            }
        }
        setNftsList(nftsFromStore.nfts)
    }, [address, chain])

    const [openCollection, setOpenCollection] = useState(false)

    const nfts = nftsList?.map((e) => {
        let list = []
        let index = nftsList.indexOf(e)
        e.nfts.map((nft, key) => {
            let listItemText = `${nft.name} - ${nft.tokenId}`
            list.push(
                <span className={styles.nft} key={key}>
                    <ListItemButton></ListItemButton>
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
                <Box
                    className={styles.collectionIntro}
                    sx={{ display: 'flex', flexDirection: 'row' }}
                >
                    <CardMedia
                        sx={{
                            width: '45px',
                            height: '45px',
                            minWidth: '45px',
                            borderRadius: '50px',
                        }}
                        image={e.collection.image}
                    ></CardMedia>
                    <Typography className={styles.collectionName}>
                        {e.collection.name}
                    </Typography>
                    {/* <Typography sx={{ textOverflow: 'ellipsis' }}>
                        {collectionDesc}
                    </Typography> */}
                </Box>
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
