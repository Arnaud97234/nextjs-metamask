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
    Tooltip,
    Zoom,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Image from 'next/image'
import Link from 'next/link'

const CollectionCard = ({ props }) => {
    const collection = props.collection
    const [open, setOpen] = useState(false)
    const handleOpen = (value) => setOpen(value)
    const handleClose = () => setOpen(false)

    // check if image exist, if not return placeholder
    const newImage = (image) => {
        let newImage
        image ? (newImage = image) : (newImage = `/defaultPicture.png`)
        return newImage
    }

    const nfts = props.nfts.map((e) => {
        const tokenId =
            e.tokenId.length > 30
                ? e.tokenId.substring(0, 27) + '...'
                : e.tokenId

        return (
            <ListItem
                onClick={() => handleOpen(e)}
                sx={{ cursor: 'pointer', my: '8px', p: '0' }}
            >
                <ListItemAvatar>
                    <Avatar alt={e.name} src={newImage(e.imageSmall)}></Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={e.name}
                    secondary={tokenId}
                ></ListItemText>
            </ListItem>
        )
    })

    const copyToClipboardButton = (id) => {
        const [copied, setCopied] = useState(false)
        const handleCopy = () => {
            setCopied(true)
            navigator.clipboard.writeText(id)
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
        return (
            <Tooltip
                title={copied ? 'Id copied' : 'Copy id'}
                TransitionComponent={Zoom}
                placement="top"
                arrow
            >
                <Button
                    sx={{ color: 'white', marginLeft: '10px' }}
                    onClick={() => handleCopy()}
                >
                    <ContentCopyIcon sx={{ height: '17px' }} />
                </Button>
            </Tooltip>
        )
    }

    return (
        <>
            <Card className={styles.card} id={styles.collectionCard}>
                <CardMedia
                    image={newImage(collection.image)}
                    title={collection.name}
                ></CardMedia>
                <CardContent sx={{ padding: 0 }}>
                    <Typography
                        sx={{
                            paddingBottom: '6px',
                            color: 'orange !important',
                        }}
                    >
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
                            color: 'orange',
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
                            src={newImage(open.imageSmall)}
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
                            <Typography>
                                {open.tokenId?.length > 35
                                    ? open.tokenId.substring(0, 32) + '...'
                                    : open.tokenId}{' '}
                                {copyToClipboardButton(open.tokenId)}
                            </Typography>
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
