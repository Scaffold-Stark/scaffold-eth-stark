import { useMemo } from "react";
import { ChainType } from "../types/chains";
import { ExtractAbiEventNames as ExtractAbiEventNamesStrk } from "abi-wan-kanabi/dist/kanabi";
import { ExtractAbiEventNames as ExtractAbiEventNamesEth } from "abitype";
import { useScaffoldEventHistory as useEthScaffoldEventHistory } from "~~/core/eth/hooks/useScaffoldEventHistory";
import {
  ContractAbi as ContractAbiEth,
  ContractName as ContractNameEth,
  EventFilters as EventFiltersEth,
} from "~~/core/eth/utils/scaffold-eth/contract";
import { useScaffoldEventHistory as useStrkScaffoldEventHistory } from "~~/core/stark/hooks/useScaffoldEventHistory";
import {
  ContractAbi as ContractAbiStrk,
  ContractName as ContractNameStrk,
} from "~~/core/stark/utils/scaffold-stark/contract";

export function useDynamicEventHistory<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStrk,
  TEventNameStrk extends ExtractAbiEventNamesStrk<ContractAbiStrk<ContractNameStrk>>,
  TEventNameEth extends ExtractAbiEventNamesEth<ContractAbiEth<TContractNameEth>>,
>({
  strk,
  eth,
  currentChain,
}: {
  strk: {
    contractName: TContractNameStrk;
    eventName: TEventNameStrk;
    fromBlock: bigint;
    filters?: any;
    blockData?: boolean;
    transactionData?: boolean;
    receiptData?: boolean;
    watch?: boolean;
    enabled?: boolean;
  };
  eth: {
    contractName: TContractNameEth;
    eventName: TEventNameEth;
    fromBlock: bigint;
    filters?: EventFiltersEth<TContractNameEth, TEventNameEth>;
    blockData?: boolean;
    transactionData?: boolean;
    receiptData?: boolean;
    watch?: boolean;
    enabled?: boolean;
  };
  currentChain: string;
}) {
  const ethOptions = {
    contractName: eth.contractName,
    eventName: eth.eventName,
    fromBlock: eth.fromBlock,
    filters: eth.filters,
    blockData: eth.blockData,
    transactionData: eth.transactionData,
    receiptData: eth.receiptData,
    watch: eth.watch,
    enabled: eth.enabled,
  };

  const strkOptions = {
    contractName: strk.contractName,
    eventName: strk.eventName,
    fromBlock: strk.fromBlock,
    filters: strk.filters,
    blockData: strk.blockData,
    transactionData: strk.transactionData,
    receiptData: strk.receiptData,
    watch: strk.watch,
    enabled: strk.enabled,
  };

  const { data: strkData, isLoading: loadingStrk } = useStrkScaffoldEventHistory(strkOptions);
  const { data: ethData, isLoading: loadingEth } = useEthScaffoldEventHistory(ethOptions);

  const result = useMemo(() => {
    if (currentChain === ChainType.Ethereum) {
      return { data: ethData, isLoading: loadingEth };
    }
    return { data: strkData, isLoading: loadingStrk };
  }, [currentChain, ethData, loadingEth, strkData, loadingStrk]);

  return result;
}
