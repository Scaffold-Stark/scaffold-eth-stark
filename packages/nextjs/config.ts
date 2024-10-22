import * as starkChains from "@starknet-react/chains";
import * as ethChains from "viem/chains";

export type SharedConfig = {
  ethereum: {
    targetNetworks: readonly ethChains.Chain[];
    pollingInterval: number;
    alchemyApiKey: string;
    walletConnectProjectId: string;
    onlyLocalBurnerWallet: boolean;
  };
  starknet: {
    targetNetworks: readonly starkChains.Chain[];
    pollingInterval: number;
    onlyLocalBurnerWallet: boolean;
    rpcProviderUrl: string;
    walletAutoConnect: boolean;
    autoConnectTTL: number;
  };
};

const sharedConfig = {
  ethereum: {
    // The networks on which your DApp is live
    targetNetworks: [ethChains.foundry, ethChains.sepolia],

    // The interval at which your front-end polls the RPC servers for new data
    // it has no effect if you only target the local network (default is 4000)
    pollingInterval: 30_000,

    // This is ours Alchemy's default API key.
    // You can get your own at https://dashboard.alchemyapi.io
    // It's recommended to store it in an env variable:
    // .env.local for local testing, and in the Vercel/system env config for live apps.
    alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

    // This is ours WalletConnect's default project ID.
    // You can get your own at https://cloud.walletconnect.com
    // It's recommended to store it in an env variable:
    // .env.local for local testing, and in the Vercel/system env config for live apps.
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

    // Only show the Burner Wallet when running on hardhat network
    onlyLocalBurnerWallet: true,
  },
  starknet: {
    targetNetworks: [starkChains.devnet],

    // The interval at which your front-end polls the RPC servers for new data
    // it has no effect if you only target the local network (default is 30_000)
    pollingInterval: 30_000,

    // Only show the Burner Wallet when running on devnet
    onlyLocalBurnerWallet: false,
    autoConnectTTL: 60000,
    rpcProviderUrl: process.env.NEXT_PUBLIC_PROVIDER_URL || "",

    /**
     * Auto connect:
     * 1. If the user was connected into a wallet before, on page reload reconnect automatically
     * 2. If user is not connected to any wallet:  On reload, connect to burner wallet if burnerWallet.enabled is true && burnerWallet.onlyLocal is false
     */
    walletAutoConnect: true,
  },
} as const satisfies SharedConfig;

export default sharedConfig;
