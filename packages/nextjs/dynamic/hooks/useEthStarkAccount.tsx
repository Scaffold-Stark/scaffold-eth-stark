import { useAccount as useStarknetAccount } from "@starknet-react/core";
import { useAccount as useEthAccount } from "wagmi";
import { useGlobalState } from "~~/dynamic/services/store/global";
import { ChainType } from "~~/dynamic/types/chains";

export function useEthStarkAccount() {
  const currentChain = useGlobalState(state => state.currentChain);
  const {
    address: starknetAccountAddress,
    isConnected: isStarknetConnected,
    isConnecting: isStarknetConnecting,
    chainId: starknetChainId,
    isDisconnected: isStarknetDisconnected,
    connector: starknetConnector,
    isReconnecting: isStarknetReconnecting,
    status: starknetStatus,
  } = useStarknetAccount();
  const {
    address: ethtAccountAddress,
    isConnected: isEthConnected,
    isConnecting: isEthConnecting,
    chainId: ethChainId,
    isDisconnected: isEthDisconnected,
    connector: ethConnector,
    isReconnecting: isEthReconnecting,
    status: ethStatus,
  } = useEthAccount();

  return {
    address: currentChain === ChainType.Starknet ? starknetAccountAddress : ethtAccountAddress,
    isConnected: currentChain === ChainType.Starknet ? isStarknetConnected : isEthConnected,
    isConnecting: currentChain === ChainType.Starknet ? isStarknetConnecting : isEthConnecting,
    chainId: currentChain === ChainType.Starknet ? starknetChainId : ethChainId,
    isDisconnected: currentChain === ChainType.Starknet ? isStarknetDisconnected : isEthDisconnected,
    connector: currentChain === ChainType.Starknet ? starknetConnector : ethConnector,
    isReconnecting: currentChain === ChainType.Starknet ? isStarknetReconnecting : isEthReconnecting,
    status: currentChain === ChainType.Starknet ? starknetStatus : ethStatus,
  };
}
