import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        address: null,
        network: null,
        balance: null
    }
}

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        addAddressToStore: (state, action) => {
            state.value.address = action.payload
        },
        addChainToStore: (state, action) => {
            state.value.network = action.payload
        },
        addBalanceToStore: (state, action) => {
            state.value.balance = action.payload
        },
        deleteFromStore: (state) => {
            state.value.address = null
            state.value.network = null
            state.value.balance = null
        }
    }
})

export const { addAddressToStore, addChainToStore, addBalanceToStore, deleteFromStore } = walletSlice.actions
export default walletSlice.reducer