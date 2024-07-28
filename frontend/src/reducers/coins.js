import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: { coins: null },
}

export const coinsSlice = createSlice({
    name: 'coins',
    initialState,
    reducers: {
        addCoinsToStore: (state, action) => {
            state.value.coins = action.payload
        },
        removeCoinsFromStore: (state) => {
            state.value.coins = null
        },
    },
})

export const { addCoinsToStore, removeCoinsFromStore } = coinsSlice.actions
export default coinsSlice.reducer
