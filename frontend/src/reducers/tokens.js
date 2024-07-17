import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        tokens: null,
    },
}

export const tokensSlice = createSlice({
    name: 'tokens',
    initialState,
    reducers: {
        addTokensToStore: (state, action) => {
            state.value.tokens = action.payload
        },
        removeTokensFromStore: (state) => {
            state.value.tokens = null
        },
    },
})

export const { addTokensToStore, removeTokensFromStore } = tokensSlice.actions
export default tokensSlice.reducer
