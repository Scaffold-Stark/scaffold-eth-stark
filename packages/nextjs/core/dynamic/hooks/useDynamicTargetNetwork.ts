import { useMemo } from "react";
import { ChainType } from "../types/chains";
import { useTargetNetwork as useEthTargetNetwork } from "~~/core/eth/hooks";
import { useTargetNetwork as useStrkTargetNetwork } from "~~/core/stark/hooks/useTargetNetwork";

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
