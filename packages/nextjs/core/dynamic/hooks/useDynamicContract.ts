import { useMemo } from "react";
import { ChainType } from "../types/chains";
import { useScaffoldContract as useEthScaffoldContract } from "~~/core/eth/hooks";
import { ContractName as ContractNameEth } from "~~/core/eth/utils/scaffold-eth/contract";
import { useScaffoldContract as useStrkScaffoldContract } from "~~/core/stark/hooks/useScaffoldContract";
import { ContractName as ContractNameStrk } from "~~/core/stark/utils/scaffold-stark/contract";

export function useDynamicContract<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStrk,
>({ contractName, currentChain }: { contractName: TContractNameEth | TContractNameStrk; currentChain: string }) {
  const { data: ethData, isLoading: loadingEth } = useEthScaffoldContract({ contractName: "YourContract" });
  const { data: strkData, isLoading: loadingStrk } = useStrkScaffoldContract({ contractName: contractName });

  const result = useMemo(() => {
    if (currentChain === ChainType.Ethereum) {
      return { data: ethData, isLoading: loadingEth };
    }
    return { data: strkData, isLoading: loadingStrk };
  }, [currentChain, ethData, loadingEth, strkData, loadingStrk]);

  return result;
}
