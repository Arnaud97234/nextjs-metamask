import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        tokens: null,
    }
}

export const tokensSlice = createSlice({
    name: 'tokens',
    initialState,
    reducers: {
        addTokensToStore: (state, action) => {
            state.value.tokens = action.payload
        }
    }
})

export const {
    addTokensToStore
} = tokensSlice.actions
export default tokensSlice.reducer