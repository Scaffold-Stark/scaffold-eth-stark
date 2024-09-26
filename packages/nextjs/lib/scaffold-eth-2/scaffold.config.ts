import config from "../../config";

export type ScaffoldConfig = typeof config.ethereum;

const scaffoldConfig = {
  targetNetworks: config.ethereum.targetNetworks,
  pollingInterval: config.ethereum.pollingInterval,
  alchemyApiKey: config.ethereum.alchemyApiKey,
  walletConnectProjectId: config.ethereum.walletConnectProjectId,
  onlyLocalBurnerWallet: config.ethereum.onlyLocalBurnerWallet,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
