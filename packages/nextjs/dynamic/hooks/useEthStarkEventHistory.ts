import { useEffect, useMemo } from "react";
import { GlobalState, useGlobalState } from "../services/store/global";
import { ChainType } from "../types/chains";
import { useScaffoldEventHistory as useEthScaffoldEventHistory } from "@scaffold-eth-2/hooks/scaffold-eth/useScaffoldEventHistory";
import {
  ContractAbi as ContractAbiEth,
  ContractName as ContractNameEth,
  UseScaffoldEventHistoryConfig as UseScaffoldEventHistoryConfigEth,
} from "@scaffold-eth-2/utils/scaffold-eth/contract";
import { useScaffoldEventHistory as useStrkScaffoldEventHistory } from "@scaffold-stark-2/hooks/scaffold-stark/useScaffoldEventHistory";
import {
  ContractAbi as ContractAbiStrk,
  ContractName as ContractNameStrk,
  UseScaffoldEventHistoryConfig as UseScaffoldEventHistoryConfigStrk,
} from "@scaffold-stark-2/utils/scaffold-stark/contract";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ExtractAbiEventNames as ExtractAbiEventNamesStrk } from "abi-wan-kanabi/dist/kanabi";
import { ExtractAbiEventNames as ExtractAbiEventNamesEth } from "abitype";

type StrkEventHistoryData = {
  data: any;
  isLoading: boolean;
  error: string | undefined;
};

type EthEventHistoryData = {
  data: any;
  isLoading: boolean;
  error: Error | null;
  status?: "pending" | "error" | "success";
  isFetchingNewEvent?: boolean;
  refetch?: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      {
        pages: any;
        pageParams: bigint[];
      },
      Error
    >
  >;
};

export function useEthStarkEventHistory<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStrk,
  TEventNameStrk extends ExtractAbiEventNamesStrk<ContractAbiStrk<ContractNameStrk>>,
  TEventNameEth extends ExtractAbiEventNamesEth<ContractAbiEth<TContractNameEth>>,
  TBlockData extends boolean = false,
  TTransactionData extends boolean = false,
  TReceiptData extends boolean = false,
>({
  strk,
  eth,
}: {
  eth: UseScaffoldEventHistoryConfigEth<TContractNameEth, TEventNameEth, TBlockData, TTransactionData, TReceiptData>;
  strk: UseScaffoldEventHistoryConfigStrk<
    TContractNameStrk,
    TEventNameStrk,
    TBlockData,
    TTransactionData,
    TReceiptData
  >;
}): StrkEventHistoryData | EthEventHistoryData {
  const currentChain = useGlobalState((state: GlobalState) => state.currentChain);

  const strkEventHistory = useStrkScaffoldEventHistory({ ...strk });
  const ethEventHistory = useEthScaffoldEventHistory({
    ...eth,
  });

  const result = useMemo(() => {
    if (currentChain === ChainType.Ethereum) {
      return ethEventHistory;
    }
    return strkEventHistory;
  }, [currentChain, ethEventHistory, strkEventHistory]);

  useEffect(() => {
    if (currentChain === ChainType.Ethereum) {
      // refetch eth event history
      ethEventHistory.refetch?.();
    } else {
      // starknet dont have refetch method
    }
  }, [currentChain, ethEventHistory]);

  return result;
}
