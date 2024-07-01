import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
const axios = require('axios')

const Nfts = () => {
    const wallet = useSelector((state) => state.wallet.value)

    const [nftsList, setNftsList] = useState(null)
    //const [collectionsList, setCollectionsList] = useState(null)
    const [error, setError] = useState(null)
    const [address, setAddress] = useState(wallet.address)
    const [chain, setChain] = useState(wallet.chain)

    useEffect(() => {
        setAddress(wallet.address)
        setChain(wallet.network)
        if (address && chain) {
            axios
                .get(`http://localhost:3000/${address}/${chain}/nfts`)
                .then((response) => {
                    //setCollectionsList(response.data.collections)
                    setNftsList(response.data)
                })
                .catch((error) => {
                    setError(error.message)
                    console.log(error)
                })
        }
    }, [wallet])

    const nfts =
        nftsList &&
        nftsList.map((e) => {
            let list = []
            e.nfts.map((nft) => {
                list.push(
                    <>
                        <Typography>{nft.name}</Typography>
                        <Typography>{nft.tokenId}</Typography>
                    </>
                )
            })

            return nftsList ? (
                <>
                    <Box>
                        <Typography>{e.collection.contract}</Typography>
                        <Typography>{e.collection.name}</Typography>
                    </Box>
                    <Box className="collection">{list}</Box>
                </>
            ) : (
                <Typography>NFT list is empty</Typography>
            )
        })

    return (
        wallet && (
            <>
                <Typography className="title" variant="h6" component="h3">
                    NFTs
                </Typography>
                <Box>{nfts}</Box>
            </>
        )
    )
}

export default Nfts
