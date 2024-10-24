import { useScaffoldWriteContract as useEthScaffoldWriteContract } from "@scaffold-eth-2/hooks/scaffold-eth";
import {
  ContractAbi as ContractAbiEth,
  ContractName as ContractNameEth,
  ScaffoldWriteContractOptions as ScaffoldWriteContractOptionsEth,
  ScaffoldWriteContractVariables as ScaffoldWriteContractVariablesEth,
} from "@scaffold-eth-2/utils/scaffold-eth/contract";
import { useScaffoldWriteContract as useStarkScaffoldWriteContract } from "@scaffold-stark-2/hooks/scaffold-stark/useScaffoldWriteContract";
import {
  ExtractAbiFunctionNamesScaffold as ExtractAbiFunctionNameStark,
  UseScaffoldWriteConfig as UseScaffoldStrkWriteConfig,
} from "@scaffold-stark-2/utils/scaffold-stark/contract";
import {
  ContractAbi as ContractAbiStrk,
  ContractName as ContractNameStark,
} from "@scaffold-stark-2/utils/scaffold-stark/contract";
import { Abi as AbiStark } from "@starknet-react/core";
import type { ExtractAbiFunctionNames as ExtractAbiFunctionNamesEth } from "abitype";
import { UseWriteContractParameters } from "wagmi";
import { GlobalState, useGlobalState } from "~~/dynamic/services/store/global";
import { ChainType } from "~~/dynamic/types/chains";

export function useEthStarkWriteContract<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStark,
  TFunctionNameEth extends ExtractAbiFunctionNamesEth<ContractAbiEth<TContractNameEth>, "nonpayable" | "payable">,
  TFunctionNameStark extends ExtractAbiFunctionNameStark<ContractAbiStrk<TContractNameStrk>, "external">,
  TAbiStark extends AbiStark,
>({
  strk,
  eth,
}: {
  strk: UseScaffoldStrkWriteConfig<TAbiStark, TContractNameStrk, TFunctionNameStark>;
  eth: {
    contractName: TContractNameEth;
    functionName: TFunctionNameEth;
    args: any[];
    options?: Omit<ScaffoldWriteContractVariablesEth<TContractNameEth, TFunctionNameEth>, "functionName" | "args">;
    hooks?: ScaffoldWriteContractOptionsEth;
    writeContractParams?: UseWriteContractParameters;
  };
}) {
  const currentChain = useGlobalState((state: GlobalState) => state.currentChain);

  const { writeContractAsync, ...ethWriteContractRemaining } = useEthScaffoldWriteContract(
    eth.contractName,
    eth.writeContractParams,
  );
  const { sendAsync, ...strkWriteContractRemaining } = useStarkScaffoldWriteContract({
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
    return { writeAsync: () => sendAsync(), ...strkWriteContractRemaining };
  }
}
