import styles from '../../styles/Home.module.css'
import { useState } from 'react'
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Modal,
    Box,
} from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

const CollectionCard = ({ props }) => {
    const collection = props.collection
    const [open, setOpen] = useState(false)
    const handleOpen = (value) => setOpen(value)
    const handleClose = () => setOpen(false)

    const nfts = props.nfts.map((e) => {
        return (
            <ListItem
                onClick={() => handleOpen(e)}
                sx={{ cursor: 'pointer', my: '8px', p: '0' }}
            >
                <ListItemAvatar>
                    <Avatar alt={e.name} src={e.imageSmall}></Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={e.name}
                    secondary={e.tokenId}
                ></ListItemText>
            </ListItem>
        )
    })

    return (
        <>
            <Card className={styles.collectionCard}>
                <CardMedia
                    image={collection.image}
                    title={collection.name}
                ></CardMedia>
                <CardContent sx={{ padding: 0 }}>
                    <Typography sx={{ paddingBottom: '6px' }}>
                        {collection.name}
                    </Typography>
                    <Typography sx={{ fontSize: '12px' }}>
                        {collection.contract}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', paddingBottom: '6px' }}>
                        {collection.symbol} - {collection.tokenType}
                    </Typography>
                    {collection.floorPrice > 0 && (
                        <Typography>
                            Floor price: {collection.floorPrice} Ξ
                        </Typography>
                    )}
                    <List sx={{ padding: 0, my: '16px' }}>{nfts}</List>
                </CardContent>
                <CardActions sx={{ padding: 0, alignSelf: 'end' }}>
                    <Link
                        className={styles.cardButton}
                        href={`https://opensea.io/collection/${collection.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View on Opensea
                    </Link>
                </CardActions>
            </Card>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                className={styles.modal}
            >
                <Box className={styles.modalContent}>
                    <Typography
                        variant="h5"
                        sx={{
                            alignSelf: 'center',
                            paddingBottom: '10px',
                            marginBottom: '10px',
                        }}
                    >
                        {collection.name}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            margin: '30px 0',
                        }}
                    >
                        <Image
                            alt={open.name}
                            src={open.imageSmall}
                            width={250}
                            height={250}
                        />
                        <span
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: '20px',
                            }}
                        >
                            <Typography variant="h5" id="modal-title">
                                {open.name}
                            </Typography>
                            <Typography>{open.tokenId}</Typography>
                        </span>
                    </Box>
                    <Typography variant="p" sx={{ px: '50px' }}>
                        {open.desc}
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default CollectionCard
