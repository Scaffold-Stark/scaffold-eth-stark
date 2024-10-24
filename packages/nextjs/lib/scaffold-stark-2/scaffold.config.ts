import config from "../../config";

export type ScaffoldConfig = typeof config.starknet;

const scaffoldConfig = {
  targetNetworks: config.starknet.targetNetworks,
  onlyLocalBurnerWallet: config.starknet.onlyLocalBurnerWallet,
  rpcProviderUrl: config.starknet.rpcProviderUrl,
  pollingInterval: config.starknet.pollingInterval,
  walletAutoConnect: config.starknet.walletAutoConnect,
  autoConnectTTL: config.starknet.autoConnectTTL,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
