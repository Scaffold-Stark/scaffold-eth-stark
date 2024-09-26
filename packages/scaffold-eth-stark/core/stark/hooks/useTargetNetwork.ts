import { useEffect } from "react";
import scaffoldConfig from "@scaffold-eth-stark/core/stark/scaffold.config";
import { useGlobalState } from "@scaffold-eth-stark/core/stark/services/store/store-strk";
import { ChainWithAttributes } from "@scaffold-eth-stark/core/stark/utils/scaffold-stark";
import { useAccount } from "@starknet-react/core";

// import { NETWORKS_EXTRA_DATA } from "@scaffold-eth-stark/utils/scaffold-stark";

/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */
export function useTargetNetwork(): { targetNetwork: ChainWithAttributes } {
  const { chainId } = useAccount();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  useEffect(() => {
    const newSelectedNetwork = scaffoldConfig.targetNetworks.find(targetNetwork => targetNetwork.id === chainId);
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.id) {
      setTargetNetwork(newSelectedNetwork);
    }

    console.log(targetNetwork);
  }, [chainId, setTargetNetwork, targetNetwork.id]);

  return {
    targetNetwork: {
      ...targetNetwork,
      //   ...NETWORKS_EXTRA_DATA[targetNetwork.id],
    },
  };
}
