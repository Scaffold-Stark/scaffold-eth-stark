import { useEffect } from "react";
import { useScaffoldReadContract as useEthScaffoldReadContract } from "@scaffold-eth/hooks/scaffold-eth";
import type { ExtractAbiFunctionNames as ExtractAbiFunctionNamesEth } from "abitype";
import { useGlobalState } from "@scaffold-eth-stark/core/dynamic/services/store/global";
import { ChainType } from "@scaffold-eth-stark/core/dynamic/types/chains";
import {
  ContractAbi as ContractAbiEth,
  ContractName as ContractNameEth,
  UseScaffoldReadConfig as UseEthScaffoldReadConfig,
} from "@scaffold-eth/utils/scaffold-eth/contract";
import { useScaffoldReadContract as useStarkScaffoldReadContract } from "@scaffold-eth-stark/core/stark/hooks";
import "@scaffold-eth-stark/core/stark/utils/scaffold-stark/contract";
import {
  ContractAbi as ContractAbiStrk,
  ContractName as ContractNameStark,
  ExtractAbiFunctionNamesScaffold as ExtractAbiFunctionNamesStrk,
  UseScaffoldReadConfig as UseStarkScaffoldReadConfig,
} from "@scaffold-eth-stark/core/stark/utils/scaffold-stark/contract";

export function useDynamicReadContract<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStark,
  TFunctionNameEth extends ExtractAbiFunctionNamesEth<ContractAbiEth<TContractNameEth>, "pure" | "view">,
  TFunctionNameStark extends ExtractAbiFunctionNamesStrk<ContractAbiStrk<TContractNameStrk>, "view">,
>({
  strk,
  eth,
  ...readConfig
}: {
  strk: { contractName: TContractNameStrk; functionName: TFunctionNameStark; args: any[] };
  eth: { contractName: TContractNameEth; functionName: TFunctionNameEth; args: any[] };
}) {
  const currentChain = useGlobalState(state => state.currentChain);
  const starknetResult = useStarkScaffoldReadContract<TContractNameStrk, TFunctionNameStark>({
    ...strk,
    ...(readConfig as UseStarkScaffoldReadConfig<TContractNameStrk, TFunctionNameStark>),
  });

  const ethResult = useEthScaffoldReadContract<TContractNameEth, TFunctionNameEth>({
    ...eth,
    ...(readConfig as UseEthScaffoldReadConfig<TContractNameEth, TFunctionNameEth>),
  });

  useEffect(() => {
    if (currentChain == ChainType.Ethereum) {
      ethResult.refetch();
    } else {
      starknetResult.refetch();
    }
  }, [currentChain]);

  return currentChain == ChainType.Ethereum ? ethResult : starknetResult;
}
