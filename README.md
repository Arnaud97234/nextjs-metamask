# Next.js Metamask Project

This is a full-featured Ethereum wallet dashboard built with Next.js and React that integrates with MetaMask wallet functionality. It allows users to connect their Ethereum wallets, view account balances, tokens, NFTs, and transaction history across multiple blockchain networks (Ethereum mainnet, Polygon, Arbitrum).

## Features Implemented

1. **Wallet Connection**: Connect/disconnect MetaMask wallet with proper error handling
2. **Account Information**: Display wallet address, network, and balance
3. **Token Management**: View ERC-20 tokens held by the wallet
4. **NFT Collection**: Browse NFT collections and individual items
5. **Transaction History**: View transaction history with details
6. **Multi-network Support**: Works across Ethereum mainnet, Polygon, Arbitrum, and Sepolia testnets

## Technologies and Libraries Used

### Frontend Technologies
1. **Next.js 16.4.6** - React framework for production applications
   - https://nextjs.org/

2. **React 18** - JavaScript library for building user interfaces
   - https://react.dev/

3. **Redux Toolkit** - State management solution for React applications
   - https://redux-toolkit.js.org/

4. **Material UI (MUI) 5.16.4** - React component library with Material Design components
   - https://mui.com/

5. **MetaMask SDK** - Ethereum wallet integration for web applications
   - https://docs.metamask.io/

### Backend Technologies
1. **Node.js/Express** - Server-side JavaScript runtime and web framework
   - https://nodejs.org/
   - https://expressjs.com/

2. **Alchemy SDK 3.2.1** - Ethereum blockchain data access layer
   - https://docs.alchemy.com/

## Architecture Overview

The application follows a standard fullstack architecture:
1. **Frontend**: Next.js/React with Redux for state management
2. **Backend**: Express.js API endpoints that fetch data from Alchemy SDK
3. **Wallet Integration**: MetaMask provider integration through web3 APIs
4. **Data Flow**: 
   - User connects wallet via MetaMask
   - Frontend stores wallet state in Redux
   - Components fetch blockchain data via API calls to backend
   - Backend uses Alchemy SDK to retrieve real-time blockchain data
   - Data is displayed in user-friendly components

## Key Components

1. **ConnectWallet Component**: Handles wallet connection/disconnection and event listeners
2. **Tokens Component**: Displays ERC-20 tokens with market data
3. **NFTs Component**: Shows NFT collections and individual items
4. **Transactions Component**: Lists transaction history
5. **Redux Store**: Manages global application state (wallet, tokens, NFTs, transactions)

## API Endpoints

1. **GET /account/:address/:chain** - Fetch account information
2. **GET /account/:address/:chain/transactions** - Get transaction history  
3. **GET /account/:address/:chain/tokens** - Retrieve ERC-20 tokens
4. **GET /account/:address/:chain/nfts** - Fetch NFT collections
5. **POST /coins/:countervalues** - Get cryptocurrency market data

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   - `yarn install` (frontend)
   - `cd backend && yarn install` (backend)
3. Set up environment variables (see .env.example)
4. Run development server:
   - `yarn dev` (frontend)
   - `cd backend && yarn start` (backend)

## Security Considerations

- Input validation on all API endpoints
- Proper error handling to prevent information leakage
- Memory leak prevention in event listeners
- Secure wallet connection flow

## Performance Optimizations

- Efficient data fetching with caching
- Event listener cleanup to prevent memory leaks
- Optimized blockchain data retrieval using Alchemy SDK
- Minimal unnecessary API calls

## Testing

The project uses standard Next.js testing patterns and includes:
- Component unit tests
- Integration tests for wallet functionality
- API endpoint validation tests

## Deployment

The application can be deployed as a standard Next.js application with:
- Production build: `yarn build`
- Start server: `yarn start`
- Backend deployment to Node.js hosting platforms