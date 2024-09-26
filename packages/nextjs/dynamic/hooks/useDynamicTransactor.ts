import { useTransactor as useEthTransactor } from "@scaffold-eth-2/hooks/scaffold-eth";
import { TransactorFuncOptions } from "@scaffold-eth-2/utils/scaffold-eth/contract";
import { useTransactor as useStrkTransactor } from "@scaffold-stark-2/hooks/scaffold-stark";
import { InvokeFunctionResponse } from "starknet";
import { Hash, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { Config } from "wagmi";
import { SendTransactionMutate } from "wagmi/query";

type TransactionFuncEth = (
  tx: (() => Promise<Hash>) | Parameters<SendTransactionMutate<Config, undefined>>[0],
  options?: TransactorFuncOptions,
) => Promise<Hash | undefined>;

type TransactionFuncStrk = (tx: () => Promise<InvokeFunctionResponse> | Promise<string>) => Promise<string | undefined>;

const localWalletClient = createWalletClient({
  chain: hardhat,
  transport: http(),
});

export const useDynamicTransactor = (): {
  ethereumTransactor: TransactionFuncEth;
  starknetTransactor: TransactionFuncStrk;
} => {
  const ethereumTransactor = useEthTransactor(localWalletClient || null);
  const starknetTransactor = useStrkTransactor();

  return {
    ethereumTransactor,
    starknetTransactor,
  };
};
