import { useDeployedContractInfo } from "@scaffold-stark-2/hooks/scaffold-stark";
import {
  AbiFunctionOutputs,
  ContractAbi,
  ContractName,
  ExtractAbiFunctionNamesScaffold,
  UseScaffoldReadConfig,
} from "@scaffold-stark-2/utils/scaffold-stark/contract";
import { Abi, useReadContract } from "@starknet-react/core";
import { BlockNumber } from "starknet";

export const useScaffoldReadContract = <
  TAbi extends Abi,
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNamesScaffold<ContractAbi<TContractName>, "view">,
>({
  contractName,
  functionName,
  args,
  ...readConfig
}: UseScaffoldReadConfig<TAbi, TContractName, TFunctionName>) => {
  const { data: deployedContract } = useDeployedContractInfo(contractName);

  return useReadContract({
    functionName,
    address: deployedContract?.address,
    abi: deployedContract?.abi,
    watch: true,
    args,
    enabled: args && (!Array.isArray(args) || !args.some(arg => arg === undefined)),
    blockIdentifier: "pending" as BlockNumber,
    ...(readConfig as any),
  }) as Omit<ReturnType<typeof useReadContract>, "data"> & {
    data: AbiFunctionOutputs<ContractAbi, TFunctionName> | undefined;
  };
};