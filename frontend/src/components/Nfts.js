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
    const [nftsList, setNftsList] = useState(nftsFromStore.nfts || [])
    const [address, setAddress] = useState(null)
    const [chain, setChain] = useState(null)
    const [error, setError] = useState(null)

    // Properly extract address and network from props
    useEffect(() => {
        let addressToUse = null;
        let chainToUse = null;

        if (props && props.address) {
            // Props are individual values
            addressToUse = props.address;
            chainToUse = props.network || '0x1';
        } else if (props && props.value && props.value.address) {
            // Props is the full wallet object
            addressToUse = props.value.address;
            chainToUse = props.value.network || '0x1';
        } else if (props && typeof props === 'object' && props.address) {
            // Props are an object with address property (fallback)
            addressToUse = props.address;
            chainToUse = props.network || '0x1';
        }

        if (addressToUse) {
            setAddress(addressToUse)
            setChain(chainToUse)
        }
        setNftsList(nftsFromStore.nfts || [])
    }, [props, nftsFromStore])

    useEffect(() => {
        if (address && chain) {
            try {
                fetch(`http://localhost:3000/account/${address}/${chain}/nfts`)
                    .then((response) => response.json())
                    .then((data) => {
                        addNfts(data)
                        setNftsList(data.nfts || []) // Update with fresh data
                    })
            } catch (err) {
                setError(err)
            }
        }
    }, [address, chain])

    const [collectionCard, setCollectionCard] = useState(false)
    const handleClick = (value) => {
        setCollectionCard(value)
    }

    // Handle case where no address is provided
    if (!address) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box id={styles.nftsByCollectionBox}>
                    <Typography
                        className={styles.boxTitle}
                        variant="h4"
                        component="h3"
                    >
                        NFTs
                    </Typography>
                    <Typography>No wallet connected</Typography>
                </Box>
            </Box>
        )
    }

    // Handle case where we have an error
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box id={styles.nftsByCollectionBox}>
                    <Typography
                        className={styles.boxTitle}
                        variant="h4"
                        component="h3"
                    >
                        NFTs
                    </Typography>
                    <Typography color="error">
                        Error loading NFTs: {typeof error === 'string' ? error : JSON.stringify(error)}
                    </Typography>
                </Box>
            </Box>
        )
    }

    const nfts = nftsList?.length > 0 ? (
        nftsList.map((e, key) => {
            // Make sure we're not rendering undefined or null values
            if (!e || typeof e !== 'object') {
                return null;
            }

            const nftsCount =
                e.nfts && e.nfts.length > 1
                    ? `${e.nfts.length} items`
                    : e.nfts && e.nfts.length === 1
                        ? `${e.nfts.length} item`
                        : '0 items'

            return (
                <ListItem
                    className={styles.collection}
                    onClick={() => handleClick(e)}
                    key={key}
                >
                    <ListItemAvatar>
                        <Avatar
                            alt={e.collection?.name || 'Unknown Collection'}
                            src={e.collection?.image}
                            className={styles.itemIcon}
                        ></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ margin: '0' }}
                        primary={e.collection?.name || 'Unknown Collection'}
                        secondary={`${nftsCount}`}
                    ></ListItemText>
                </ListItem>
            )
        })
    ) : (
        <Typography>No NFTs found</Typography>
    )

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box id={styles.nftsByCollectionBox}>
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
}

export default Nfts
