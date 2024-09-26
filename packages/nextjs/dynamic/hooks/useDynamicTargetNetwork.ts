import { useMemo } from "react";
import { ChainType } from "../types/chains";
import { useTargetNetwork as useEthTargetNetwork } from "@scaffold-eth-2/hooks/scaffold-eth";
import { useTargetNetwork as useStrkTargetNetwork } from "@scaffold-stark-2/hooks/scaffold-stark/useTargetNetwork";

export function useDynamicTargetNetwork({ currentChain }: { currentChain: string }) {
  const { targetNetwork: strkNetwork } = useStrkTargetNetwork();
  const { targetNetwork: ethNetwork } = useEthTargetNetwork();

  const result = useMemo(() => {
    if (currentChain === ChainType.Ethereum) {
      return { targetNetwork: ethNetwork };
    }
    return { targetNetwork: strkNetwork };
  }, [currentChain, ethNetwork, strkNetwork]);

  return result;
}
