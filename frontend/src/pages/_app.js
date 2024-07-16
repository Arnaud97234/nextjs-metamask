import '@/styles/globals.css'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import wallet from '../reducers/wallet'
import nfts from '../reducers/nfts'

const store = configureStore({
    reducer: { wallet, nfts },
})

export default function App({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    )
}
