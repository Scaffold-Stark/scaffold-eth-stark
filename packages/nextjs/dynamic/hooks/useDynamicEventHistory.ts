import { useMemo } from "react";
import { ChainType } from "../types/chains";
import { useScaffoldEventHistory as useEthScaffoldEventHistory } from "@scaffold-eth-2/hooks/scaffold-eth/useScaffoldEventHistory";
import {
  ContractAbi as ContractAbiEth,
  ContractName as ContractNameEth,
  EventFilters as EventFiltersEth,
} from "@scaffold-eth-2/utils/scaffold-eth/contract";
import { useScaffoldEventHistory as useStrkScaffoldEventHistory } from "@scaffold-stark-2/hooks/scaffold-stark/useScaffoldEventHistory";
import {
  ContractAbi as ContractAbiStrk,
  ContractName as ContractNameStrk,
} from "@scaffold-stark-2/utils/scaffold-stark/contract";
import { ExtractAbiEventNames as ExtractAbiEventNamesStrk } from "abi-wan-kanabi/dist/kanabi";
import { ExtractAbiEventNames as ExtractAbiEventNamesEth } from "abitype";

export function useDynamicEventHistory<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStrk,
  TEventNameStrk extends ExtractAbiEventNamesStrk<ContractAbiStrk<ContractNameStrk>>,
  TEventNameEth extends ExtractAbiEventNamesEth<ContractAbiEth<TContractNameEth>>,
>({
  contractName,
  eventName,
  fromBlock,
  filters,
  blockData = false,
  transactionData = false,
  receiptData = false,
  watch = false,
  enabled = false,
  currentChain,
}: {
  contractName: TContractNameEth | TContractNameStrk;
  eventName: TEventNameEth | TEventNameStrk;
  fromBlock: bigint;
  filters?: EventFiltersEth<TContractNameEth, TEventNameEth> | any;
  blockData?: boolean;
  transactionData?: boolean;
  receiptData?: boolean;
  watch?: boolean;
  enabled?: boolean;
  currentChain: string;
}) {
  const {
    data: strkData,
    isLoading: loadingStrk,
    error: strkError,
  } = useStrkScaffoldEventHistory({
    contractName: contractName as TContractNameStrk,
    eventName: eventName as TEventNameStrk,
    fromBlock: fromBlock,
    filters: filters as any,
    blockData: blockData,
    transactionData: transactionData,
    receiptData: receiptData,
    watch: watch,
    enabled: enabled,
  });
  const {
    data: ethData,
    isLoading: loadingEth,
    error: ethError,
  } = useEthScaffoldEventHistory({
    contractName: contractName as TContractNameEth,
    eventName: eventName as TEventNameEth,
    fromBlock: fromBlock,
    filters: filters as any,
    blockData: blockData,
    transactionData: transactionData,
    receiptData: receiptData,
    watch: watch,
    enabled: enabled,
  });

  const result = useMemo(() => {
    if (currentChain === ChainType.Ethereum) {
      return { data: ethData, isLoading: loadingEth, error: ethError };
    }
    return { data: strkData, isLoading: loadingStrk, error: strkError };
  }, [currentChain, strkData, loadingStrk, strkError, ethData, loadingEth, ethError]);

  return result;
}
