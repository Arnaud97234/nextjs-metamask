import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        nfts: null,
    },
}

export const nftsSlice = createSlice({
    name: 'nfts',
    initialState,
    reducers: {
        addNftsToStore: (state, action) => {
            state.value.nfts = action.payload
        },
    },
})

export const { addNftsToStore } = nftsSlice.actions
export default nftsSlice.reducer
