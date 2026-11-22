import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        transactions: null,
    },
}

export const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        addTransactionsToStore: (state, action) => {
            state.value.transactions = action.payload
        },
        removeTransactionsFromStore: (state) => {
            state.value.transactions = null
        },
    },
})

export const { addTransactionsToStore, removeTransactionsFromStore } = transactionsSlice.actions
export default transactionsSlice.reducer