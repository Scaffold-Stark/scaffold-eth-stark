import { useEffect } from "react";
import { useScaffoldReadContract as useEthScaffoldReadContract } from "@scaffold-eth-2/hooks/scaffold-eth";
import {
  ContractAbi as ContractAbiEth,
  ContractName as ContractNameEth,
  UseScaffoldReadConfig as UseEthScaffoldReadConfig,
} from "@scaffold-eth-2/utils/scaffold-eth/contract";
import { useScaffoldReadContract as useStarkScaffoldReadContract } from "@scaffold-stark-2/hooks/scaffold-stark/useScaffoldReadContract";
import {
  ContractAbi as ContractAbiStrk,
  ContractName as ContractNameStark,
  ExtractAbiFunctionNamesScaffold as ExtractAbiFunctionNamesStrk,
  UseScaffoldReadConfig as UseStarkScaffoldReadConfig,
} from "@scaffold-stark-2/utils/scaffold-stark/contract";
import "@scaffold-stark-2/utils/scaffold-stark/contract";
import { Abi as AbiStark } from "@starknet-react/core";
import type { ExtractAbiFunctionNames as ExtractAbiFunctionNamesEth } from "abitype";
import { GlobalState, useGlobalState } from "~~/dynamic/services/store/global";
import { ChainType } from "~~/dynamic/types/chains";

export function useDynamicReadContract<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStark,
  TFunctionNameEth extends ExtractAbiFunctionNamesEth<ContractAbiEth<TContractNameEth>, "pure" | "view">,
  TFunctionNameStark extends ExtractAbiFunctionNamesStrk<ContractAbiStrk<TContractNameStrk>, "view">,
  TAbiStark extends AbiStark,
>({
  strk,
  eth,
  ...readConfig
}: {
  strk: { contractName: TContractNameStrk; functionName: TFunctionNameStark; args: any[] };
  eth: { contractName: TContractNameEth; functionName: TFunctionNameEth; args: any[] };
}) {
  const currentChain = useGlobalState((state: GlobalState) => state.currentChain);
  const starknetResult = useStarkScaffoldReadContract<TAbiStark, TContractNameStrk, TFunctionNameStark>({
    ...strk,
    ...(readConfig as UseStarkScaffoldReadConfig<TAbiStark, TContractNameStrk, TFunctionNameStark>),
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
