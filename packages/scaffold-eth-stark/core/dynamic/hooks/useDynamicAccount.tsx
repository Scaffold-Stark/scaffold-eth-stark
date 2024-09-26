import { useAccount as useStarknetAccount } from "@starknet-react/core";
import { useAccount as useEthAccount } from "wagmi";
import { useGlobalState } from "@scaffold-eth-stark/core/dynamic/services/store/global";
import { ChainType } from "@scaffold-eth-stark/core/dynamic/types/chains";

export function useDynamicAccount() {
  const currentChain = useGlobalState(state => state.currentChain);
  const { address: starknetAccountAddress } = useStarknetAccount();
  const { address: ethtAccountAddress } = useEthAccount();

  return {
    address: (() => {
      let addr;
      if (currentChain == ChainType.Ethereum) {
        // wagmi here
        addr = ethtAccountAddress;
      } else {
        // starknet react here
        addr = starknetAccountAddress;
      }
      return addr;
    })(),
  };
}
