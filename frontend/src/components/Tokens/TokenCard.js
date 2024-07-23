import styles from '../../styles/Home.modules.css'
import { useState } from 'react'
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Avatar,
    Box,
} from '@mui/material'
import Link from 'next/link'

const tokenCard = ({ props }) => {
    const token = props.token

    // check if image exist, if not return placeholder
    const newLogo = (image = props.token.image) => {
        let newImage
        image ? (newImage = image) : (newImage = `/defaultPicture.png`)
        return newImage
    }

    return <Card className={styles.card} id={styles.tokenCard}></Card>
}

export default tokenCard
