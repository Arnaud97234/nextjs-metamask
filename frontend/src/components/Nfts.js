import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    ListItemText,
    ListItem,
    List,
    ListItemAvatar,
    Avatar,
} from '@mui/material'
import { addNftsToStore } from '@/reducers/nfts'
import { useSelector, useDispatch } from 'react-redux'
import CollectionCard from '@/components/Nft/CollectionCard'

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
                fetch(`http://localhost:3000/account/${address}/${chain}/nfts`)
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

    const [collectionCard, setCollectionCard] = useState(false)
    const handleClick = (value) => {
        setCollectionCard(value)
    }

    const nfts = nftsList?.map((e) => {
        const nftsCount =
            e.nfts.length > 1
                ? `${e.nfts.length} items`
                : `${e.nfts.length} item`

        return nftsList ? (
            <ListItem
                className={styles.collection}
                onClick={() => handleClick(e)}
            >
                <ListItemAvatar>
                    <Avatar
                        alt={e.collection.name}
                        src={e.collection.image}
                        className={styles.itemIcon}
                    ></Avatar>
                </ListItemAvatar>
                <ListItemText
                    sx={{ margin: '0' }}
                    primary={e.collection.name}
                    secondary={`${nftsCount}`}
                ></ListItemText>
            </ListItem>
        ) : (
            <Typography>NFT list is empty</Typography>
        )
    })

    return (
        address &&
        nfts && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box id={styles.nftsByCollectionContainer}>
                    <Typography
                        className={styles.boxTitle}
                        variant="h4"
                        component="h3"
                    >
                        NFTs
                    </Typography>
                    <List id={styles.collectionsList}>{nfts}</List>
                </Box>
                {collectionCard && <CollectionCard props={collectionCard} />}
            </Box>
        )
    )
}

export default Nfts
