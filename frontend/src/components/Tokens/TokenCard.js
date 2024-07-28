import styles from '../../styles/Home.module.css'
import { useEffect, useState } from 'react'
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
import { useSelector } from 'react-redux'

const tokenCard = ({ props }) => {
    const { name, logo, symbol, balance, contractAddress } = props
    const coins = useSelector((state) => state.coins.value)
    const array = coins.coins?.filter((e) => e.symbol == symbol)
    const tokenMarketData = array[0]

    const ethPrice =
        tokenMarketData?.quote &&
        `value: ${Number(tokenMarketData?.quote?.ETH?.price)} Ξ`
    const rank =
        tokenMarketData?.cmc_rank && `rank: ${tokenMarketData.cmc_rank}`

    // check if image exist, if not return placeholder
    const newLogo = (image = logo) => {
        let newImage
        image
            ? (newImage = image)
            : (newImage = `https://res.coinpaper.com/coinpaper/RETH_hrkkkj.png`)
        return newImage
    }

    return (
        <Card className={styles.card} id={styles.tokenCard}>
            <CardMedia
                image={newLogo()}
                title={symbol}
                sx={{ height: '50px', width: '50px', borderRadius: '50px' }}
                className={styles.cardMedia}
            ></CardMedia>
            <CardContent sx={{ padding: 0 }}>
                <Typography
                    sx={{
                        paddingBottom: '6px',
                        color: 'orange !important',
                    }}
                >
                    {name}
                </Typography>
                {rank && (
                    <Typography sx={{ fontSize: '12px' }}>{rank}</Typography>
                )}
                <Typography sx={{ fontSize: '12px' }}>
                    {contractAddress}
                </Typography>
                <Typography sx={{ fontSize: '12px', paddingBottom: '6px' }}>
                    balance: {balance} {symbol}
                </Typography>
                {ethPrice && (
                    <Typography sx={{ fontSize: '12px', paddingBottom: '6px' }}>
                        {ethPrice}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )
}

export default tokenCard
