import { useGlobalState } from "@scaffold-eth-stark/core/dynamic/services/store/global";
import { ChainType } from "@scaffold-eth-stark/core/dynamic/types/chains";
import { useScaffoldWriteContract as useStarkScaffoldWriteContract } from "@scaffold-eth-stark/core/stark/hooks";
import {
  ExtractAbiFunctionNamesScaffold as ExtractAbiFunctionNameStark,
  UseScaffoldWriteConfig as UseScaffoldStrkWriteConfig,
} from "@scaffold-eth-stark/core/stark/utils/scaffold-stark/contract";
import {
  ContractAbi as ContractAbiStrk,
  ContractName as ContractNameStark,
} from "@scaffold-eth-stark/core/stark/utils/scaffold-stark/contract";
import { useScaffoldWriteContract as useEthScaffoldWriteContract } from "@scaffold-eth/hooks/scaffold-eth/";
import {
  ContractAbi as ContractAbiEth,
  ContractName as ContractNameEth,
  ScaffoldWriteContractOptions as ScaffoldWriteContractOptionsEth,
  ScaffoldWriteContractVariables as ScaffoldWriteContractVariablesEth,
} from "@scaffold-eth/utils/scaffold-eth/contract";
import type { ExtractAbiFunctionNames as ExtractAbiFunctionNamesEth } from "abitype";
import { UseWriteContractParameters } from "wagmi";

export function useDynamicWriteContract<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStark,
  TFunctionNameEth extends ExtractAbiFunctionNamesEth<ContractAbiEth<TContractNameEth>, "nonpayable" | "payable">,
  TFunctionNameStark extends ExtractAbiFunctionNameStark<ContractAbiStrk<TContractNameStrk>, "external">,
>({
  strk,
  eth,
}: {
  strk: UseScaffoldStrkWriteConfig<TContractNameStrk, TFunctionNameStark>;
  eth: {
    contractName: TContractNameEth;
    functionName: TFunctionNameEth;
    args: any[];
    options?: Omit<ScaffoldWriteContractVariablesEth<TContractNameEth, TFunctionNameEth>, "functionName" | "args">;
    hooks?: ScaffoldWriteContractOptionsEth;
    writeContractParams?: UseWriteContractParameters;
  };
}) {
  const currentChain = useGlobalState(state => state.currentChain);

  const { writeContractAsync, ...ethWriteContractRemaining } = useEthScaffoldWriteContract(
    eth.contractName,
    eth.writeContractParams,
  );
  const { writeAsync, ...strkWriteContractRemaining } = useStarkScaffoldWriteContract({
    ...strk,
  });

  if (currentChain == ChainType.Ethereum) {
    return {
      writeAsync: () =>
        writeContractAsync(
          {
            ...eth.options,
            functionName: eth.functionName as TFunctionNameEth,
            args: eth.args as any[],
          } as unknown as ScaffoldWriteContractVariablesEth<TContractNameEth, TFunctionNameEth>,
          eth.hooks,
        ),
      ...ethWriteContractRemaining,
    };
  } else {
    return { writeAsync, ...strkWriteContractRemaining };
  }
}
