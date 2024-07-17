import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: { nfts: null },
}

export const nftsSlice = createSlice({
    name: 'nfts',
    initialState,
    reducers: {
        addNftsToStore: (state, action) => {
            state.value.nfts = action.payload
        },
        removeNftsFromStore: (state) => {
            state.value.nfts = null
        },
    },
})

export const { addNftsToStore, removeNftsFromStore } = nftsSlice.actions
export default nftsSlice.reducer
