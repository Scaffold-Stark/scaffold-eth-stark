import { useMemo } from "react";
import { ChainType } from "../types/chains";
import { useScaffoldContract as useEthScaffoldContract } from "@scaffold-eth-2/hooks/scaffold-eth";
import { ContractName as ContractNameEth } from "@scaffold-eth-2/utils/scaffold-eth/contract";
import { useScaffoldContract as useStrkScaffoldContract } from "@scaffold-stark-2/hooks/scaffold-stark/useScaffoldContract";
import { ContractName as ContractNameStrk } from "@scaffold-stark-2/utils/scaffold-stark/contract";

export function useDynamicContract<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStrk,
>({ contractName, currentChain }: { contractName: TContractNameEth | TContractNameStrk; currentChain: string }) {
  const { data: ethData, isLoading: loadingEth } = useEthScaffoldContract({
    contractName: contractName as TContractNameEth,
  });
  const { data: strkData, isLoading: loadingStrk } = useStrkScaffoldContract({
    contractName: contractName as TContractNameStrk,
  });

  const result = useMemo(() => {
    let data = null;
    let isLoading = false;
    let error = null;

    switch (currentChain) {
      case ChainType.Ethereum:
        if (!ethData) {
          error = "Ethereum contract not found";
        } else {
          data = ethData;
          isLoading = loadingEth;
        }
        break;

      case ChainType.Starknet:
        if (!strkData) {
          error = "StarkNet contract not found";
        } else {
          data = strkData;
          isLoading = loadingStrk;
        }
        break;

      default:
        error = "Unsupported chain type";
    }

    return { data, isLoading, error };
  }, [currentChain, ethData, loadingEth, strkData, loadingStrk]);

  return result;
}
