"use client";

import { useDisplayUsdMode } from "@scaffold-eth-2/hooks/scaffold-eth/useDisplayUsdMode";
import { useTargetNetwork } from "@scaffold-eth-2/hooks/scaffold-eth/useTargetNetwork";
import { useWatchBalance } from "@scaffold-eth-2/hooks/scaffold-eth/useWatchBalance";
import { useGlobalState } from "@scaffold-eth-2/services/store/store";
import { Address, formatEther } from "viem";

type BalanceProps = {
  address?: Address;
  className?: string;
  usdMode?: boolean;
};

/**
 * Display (ETH & USD) balance of an ETH address.
 */
export const Balance = ({ address, className = "", usdMode }: BalanceProps) => {
  const { targetNetwork } = useTargetNetwork();
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const isNativeCurrencyPriceFetching = useGlobalState(state => state.nativeCurrency.isFetching);

  const {
    data: balance,
    isError,
    isLoading,
  } = useWatchBalance({
    address,
  });

  const { displayUsdMode, toggleDisplayUsdMode } = useDisplayUsdMode({ defaultUsdMode: usdMode });

  if (!address || isLoading || balance === null || (isNativeCurrencyPriceFetching && nativeCurrencyPrice === 0)) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning">Error</div>
      </div>
    );
  }

  const formattedBalance = balance ? Number(formatEther(balance.value)) : 0;

  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      onClick={toggleDisplayUsdMode}
    >
      <div className="w-full flex items-center justify-center">
        {displayUsdMode ? (
          <>
            <span className="text-white text-[0.8em] font-bold mr-1">$</span>
            <span className="text-white">{(formattedBalance * nativeCurrencyPrice).toFixed(2)}</span>
          </>
        ) : (
          <>
            <span className="text-white">{formattedBalance.toFixed(4)}</span>
            <span className="text-white text-[0.8em] font-bold ml-1">{targetNetwork.nativeCurrency.symbol}</span>
          </>
        )}
      </div>
    </button>
  );
};
