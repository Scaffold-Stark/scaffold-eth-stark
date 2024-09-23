# Starknet and Eth cross-chain template

This project is a template for creating Starknet and Eth cross-chain applications. It uses the Scaffold-ETH-2 and Scaffold-Starknet-2 libraries to create a project that can be used as a starting point for any starknet and eth application.

### Prerequisites

Check requirements at [scaffold-stark-2](https://github.com/Scaffold-Stark/scaffold-stark-2) and [scaffold-eth-2](https://github.com/scaffold-eth/scaffold-eth-2/tree/foundry) (only the foundryup)

## Getting Started

1. Clone the repo

```bash
git clone https://github.com/Scaffold-Stark/scaffold-eth-stark
cd scaffold-eth-stark
```

2. Install dependencies

```bash
yarn install
```

3. Run a local eth network in the first terminal:

```bash
yarn chain::eth
```

4. Run a local starknet network in the second terminal:

```bash
yarn chain::strk
```

5. Copy .env.example to .env and set the correct variables

```bash
cp ./packages/foundry/.env.example ./packages/foundry/.env
cp ./packages/snfoundry/.env.example ./packages/snfoundry/.env
```

6. Deploy your smart contract(s) on the eth network:

```bash
yarn deploy::eth
```

6. Deploy your smart contract(s) on the starknet network:

```bash
yarn deploy::strk
```

7. Run the frontend:

```bash
yarn start
```

8. Visit http://localhost:3000 to see the app
