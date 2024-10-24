import { useMemo } from "react";
import { GlobalState, useGlobalState } from "../services/store/global";
import { ChainType } from "../types/chains";
import { useTargetNetwork as useEthTargetNetwork } from "@scaffold-eth-2/hooks/scaffold-eth";
import { useTargetNetwork as useStrkTargetNetwork } from "@scaffold-stark-2/hooks/scaffold-stark/useTargetNetwork";

export function useEthStarkTargetNetwork() {
  const currentChain = useGlobalState((state: GlobalState) => state.currentChain);

  const { targetNetwork: strkNetwork } = useStrkTargetNetwork();
  const { targetNetwork: ethNetwork } = useEthTargetNetwork();

  const result = useMemo(() => {
    if (currentChain === ChainType.Ethereum) {
      return ethNetwork;
    }
    return strkNetwork;
  }, [currentChain, ethNetwork, strkNetwork]);

  return result;
}
