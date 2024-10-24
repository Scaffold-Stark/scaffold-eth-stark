import { useMemo } from "react";
import { GlobalState, useGlobalState } from "../services/store/global";
import { ChainType } from "../types/chains";
import { useScaffoldContract as useEthScaffoldContract } from "@scaffold-eth-2/hooks/scaffold-eth";
import { ContractName as ContractNameEth } from "@scaffold-eth-2/utils/scaffold-eth/contract";
import { useScaffoldContract as useStrkScaffoldContract } from "@scaffold-stark-2/hooks/scaffold-stark/useScaffoldContract";
import { ContractName as ContractNameStrk } from "@scaffold-stark-2/utils/scaffold-stark/contract";
import { GetWalletClientReturnType } from "wagmi/actions";

export function useEthStarkContract<
  TContractNameEth extends ContractNameEth,
  TContractNameStrk extends ContractNameStrk,
  TWalletClient extends Exclude<GetWalletClientReturnType, null> | undefined,
>({
  eth,
  strk,
}: {
  eth: { contractName: TContractNameEth; walletClient?: TWalletClient | null };
  strk: { contractName: TContractNameStrk };
}) {
  const currentChain = useGlobalState((state: GlobalState) => state.currentChain);

  const { data: ethData, isLoading: loadingEth } = useEthScaffoldContract({
    contractName: eth.contractName,
    walletClient: eth.walletClient,
  });
  const { data: strkData, isLoading: loadingStrk } = useStrkScaffoldContract({
    contractName: strk.contractName,
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
