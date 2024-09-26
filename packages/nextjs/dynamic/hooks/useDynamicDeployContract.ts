import { useMemo } from "react";
import { ChainType } from "../types/chains";
import { useDeployedContractInfo as useEthDeployedContractInfo } from "@scaffold-eth-2/hooks/scaffold-eth";
import { ContractName as ContractNameEth } from "@scaffold-eth-2/utils/scaffold-eth/contract";
import { useDeployedContractInfo as useStrkDeployedContractInfo } from "@scaffold-stark-2/hooks/scaffold-stark";
import { ContractName as ContractNameStrk } from "@scaffold-stark-2/utils/scaffold-stark/contract";

export function useDynamicDeployContract<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStrk,
>({ currentChain, contractName }: { currentChain: string; contractName: TContractNameEth | TContractNameStrk }) {
  const { data: ethDeploy, isLoading: isEthLoading } = useEthDeployedContractInfo(contractName as TContractNameEth);
  const { data: strkDeploy, isLoading: isStrkLoading } = useStrkDeployedContractInfo(contractName as TContractNameStrk);

  const result = useMemo(() => {
    let data = null;
    let isLoading = false;
    let error = null;

    switch (currentChain) {
      case ChainType.Ethereum:
        if (!ethDeploy) {
          error = "Ethereum contract not deployed";
        } else {
          data = ethDeploy;
          isLoading = isEthLoading;
        }
        break;

      case ChainType.Starknet:
        if (!strkDeploy) {
          error = "StarkNet contract not deployed";
        } else {
          data = strkDeploy;
          isLoading = isStrkLoading;
        }
        break;

      default:
        error = "Unsupported chain type";
    }

    return { data, isLoading, error };
  }, [currentChain, ethDeploy, isEthLoading, isStrkLoading, strkDeploy]);

  return result;
}
