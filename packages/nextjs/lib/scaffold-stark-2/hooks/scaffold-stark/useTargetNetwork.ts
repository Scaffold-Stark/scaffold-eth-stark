import { useEffect } from "react";
import { useAccount } from "@scaffold-stark-2/hooks/useAccount";
import scaffoldConfig from "@scaffold-stark-2/scaffold.config";
import { useGlobalState } from "@scaffold-stark-2/services/store/store";
import { ChainWithAttributes } from "@scaffold-stark-2/utils/scaffold-stark";

// import { NETWORKS_EXTRA_DATA } from "@scaffold-stark-2/utils/scaffold-stark";

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
  }, [chainId, setTargetNetwork, targetNetwork.id]);

  return {
    targetNetwork: {
      ...targetNetwork,
      //   ...NETWORKS_EXTRA_DATA[targetNetwork.id],
    },
  };
}
