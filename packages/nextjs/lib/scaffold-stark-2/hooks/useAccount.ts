import { useEffect, useState } from "react";
import { UseAccountResult, useAccount as useStarknetReactAccount } from "@starknet-react/core";

/**
 * Wrapper around starknet react's useAccount hook to address issues
 * @returns {UseAccountResult}
 */
export function useAccount(): UseAccountResult {
  const { account, ...rest } = useStarknetReactAccount();
  const [accountChainId, setAccountChainId] = useState(0n);

  // effect to get chain id and address from account
  useEffect(() => {
    if (account) {
      const getChainId = async () => {
        const chainId = await account.channel.getChainId();
        setAccountChainId(BigInt(chainId as string));
      };

      getChainId();
    }
  }, [account]);

  return {
    account,
    ...rest,
    chainId: accountChainId,
  } as UseAccountResult;
}
