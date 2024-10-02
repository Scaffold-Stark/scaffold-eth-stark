export interface EVMChain {
    name: string;
    chainId: number;
    // rpcUrl: string;
}

export const evmChains: EVMChain[] = [
    {
        name: "Ethereum",
        chainId: 1,
        // rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    },
    {
        name: "Arbitrum",
        chainId: 42161,
        // rpcUrl: "https://arb1.arbitrum.io/rpc",
    },
    {
        name : "Hardhat",
        chainId : 31337,
        // rpcUrl : "",
    },
    {
        name: "Binance Smart Chain",
        chainId: 56,
        // rpcUrl: "https://bsc-dataseed.binance.org/",
    },
    {
        name: "Polygon",
        chainId: 137,
        // rpcUrl: "https://polygon-rpc.com/",
    },
    {
        name: "Avalanche",
        chainId: 43114,
        // rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    },
];