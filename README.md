# NFT Minting dApp

## Overview
A decentralized application (dApp) for creating, minting, and managing NFTs on the Sepolia testnet using Ethereum blockchain technology.

## Features
- Connect MetaMask wallet
- Upload and mint NFTs with image, name, and description
- View personal NFT collection
- Transfer NFTs between wallets

## Tech Stack
- Frontend: Next.js 15
- Blockchain: Hardhat, Ethers.js
- Smart Contract: Solidity (OpenZeppelin ERC721)
- IPFS Storage: Pinata
- Styling: Tailwind CSS

## Prerequisites
- Node.js
- MetaMask Browser Extension
- Sepolia Testnet ETH

## Environment Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=<your_deployed_contract_address>
   SEPOLIA_RPC_URL=<sepolia_rpc_endpoint>
   PRIVATE_KEY=<your_wallet_private_key>
   ETHERSCAN_API_KEY=<etherscan_api_key>
   NEXT_PUBLIC_PINATA_API_KEY=<pinata_api_key>
   NEXT_PUBLIC_PINATA_SECRET_KEY=<pinata_secret_key>
   INFURA_PROJECT_ID=<infura_project_id>
   ```

## Smart Contract Deployment
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Running the Application
```bash
npm run dev
```

## Key Components
- `NFTMarketplace.sol`: ERC721 smart contract
- `UploadForm.js`: NFT minting interface
- `MyNFTs.js`: User's NFT collection page
- `ConnectWallet.js`: Web3 wallet connection
