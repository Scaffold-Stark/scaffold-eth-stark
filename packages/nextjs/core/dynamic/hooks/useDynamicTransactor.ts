import { InvokeFunctionResponse } from "starknet";
import { Hash, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { Config } from "wagmi";
import { SendTransactionMutate } from "wagmi/query";
import { useTransactor as useEthTransactor } from "~~/core/eth/hooks";
import { TransactorFuncOptions } from "~~/core/eth/utils/scaffold-eth/contract";
import { useTransactor as useStrkTransactor } from "~~/core/stark/hooks";

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
  const ethereumTransactor = useEthTransactor(localWalletClient);
  const starknetTransactor = useStrkTransactor();

  return {
    ethereumTransactor,
    starknetTransactor,
  };
};
