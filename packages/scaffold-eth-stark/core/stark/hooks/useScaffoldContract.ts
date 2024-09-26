import { useMemo } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useDeployedContractInfo } from "@scaffold-eth-stark/core/stark/hooks";
import { ContractName } from "@scaffold-eth-stark/core/stark/utils/scaffold-stark/contract";
import { useAccount } from "@starknet-react/core";
import { Contract, RpcProvider } from "starknet";

export const useScaffoldContract = <TContractName extends ContractName>({
  contractName,
}: {
  contractName: TContractName;
}) => {
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);

  const { targetNetwork } = useTargetNetwork();
  const { account } = useAccount();
  const publicNodeUrl = targetNetwork.rpcUrls.public.http[0];

  const publicClient = useMemo(() => {
    return new RpcProvider({
      nodeUrl: publicNodeUrl,
    });
  }, [publicNodeUrl]);
  let contract = undefined;
  if (deployedContractData) {
    contract = new Contract([...deployedContractData.abi], deployedContractData.address, publicClient);
  }

  return {
    data: contract,
    isLoading: deployedContractLoading,
  };
};
