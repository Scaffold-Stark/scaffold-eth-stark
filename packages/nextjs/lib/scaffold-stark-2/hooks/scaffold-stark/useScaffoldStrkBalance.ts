import { useDeployedContractInfo } from "./useDeployedContractInfo";
import { Address } from "@starknet-react/chains";
import { useReadContract } from "@starknet-react/core";
import { Abi } from "abi-wan-kanabi";
import { formatUnits } from "ethers";
import { BlockNumber } from "starknet";

type UseScaffoldStrkBalanceProps = {
  address?: Address | string;
};

const useScaffoldStrkBalance = ({ address }: UseScaffoldStrkBalanceProps) => {
  const { data: deployedContract } = useDeployedContractInfo("Strk");

  const { data, ...props } = useReadContract({
    functionName: "balanceOf",
    address: deployedContract?.address,
    abi: deployedContract?.abi as Abi as any[],
    watch: true,
    enabled: true,
    args: address ? [address] : [],
    blockIdentifier: "pending" as BlockNumber,
  });

  return {
    value: data as unknown as bigint,
    decimals: 18,
    symbol: "STRK",
    formatted: data ? formatUnits(data as unknown as bigint) : "0",
    ...props,
  };
};

export default useScaffoldStrkBalance;
