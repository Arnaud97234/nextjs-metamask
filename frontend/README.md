# Next.js Metamask Frontend

This is the frontend component of the Next.js Metamask project that integrates Ethereum blockchain data with MetaMask wallet functionality.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/components/Wallet/ConnectWallet.js` - Main wallet connection component with MetaMask integration
- `src/pages/index.js` - Main application page
- `src/utils/index.js` - Utility functions for blockchain data handling
- `src/reducers/wallet.js` - Redux store for wallet state management

## Features

- Wallet connection with MetaMask SDK
- Account information display
- Token balance tracking
- NFT collection browsing
- Transaction history viewing
- Cross-chain support (Ethereum, Polygon, Arbitrum)

## Dependencies

- Next.js 14.2.2
- React 18
- Redux Toolkit
- MetaMask SDK React
- Alchemy SDK for blockchain data fetching

## Environment Variables

The application requires the following environment variables to be configured:

- `ALCHEMY_API_KEY` - Your Alchemy API key for blockchain data access
- `CMC_API_KEY` - Your CoinMarketCap API key for token price data (optional)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!