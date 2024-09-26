import { useEffect } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import scaffoldConfig from "@scaffold-stark-2/scaffold.config";
import { useGlobalState } from "@scaffold-stark-2/services/store/store";
import { fetchPriceFromCoingecko } from "@scaffold-stark-2/utils/scaffold-stark";
import { useInterval } from "usehooks-ts";

/**
 * Get the price of Native Currency based on Native Token/DAI trading pair from Uniswap SDK
 */
export const useNativeCurrencyPrice = () => {
  const { targetNetwork } = useTargetNetwork();
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);
  const strkCurrencyPrice = useGlobalState(state => state.strkCurrencyPrice);
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  const setStrkCurrencyPrice = useGlobalState(state => state.setStrkCurrencyPrice);
  // Get the price of ETH & STRK from Coingecko on mount
  useEffect(() => {
    (async () => {
      if (nativeCurrencyPrice == 0) {
        const price = await fetchPriceFromCoingecko("ETH");
        setNativeCurrencyPrice(price);
      }
      if (strkCurrencyPrice == 0) {
        const strkPrice = await fetchPriceFromCoingecko("STRK");
        setStrkCurrencyPrice(strkPrice);
      }
    })();
  }, [targetNetwork]);

  // Get the price of ETH & STRK from Coingecko at a given interval
  useInterval(async () => {
    const price = await fetchPriceFromCoingecko("ETH");
    setNativeCurrencyPrice(price);
    const strkPrice = await fetchPriceFromCoingecko("STRK");
    setStrkCurrencyPrice(strkPrice);
  }, scaffoldConfig.pollingInterval);

  //return nativeCurrencyPrice;
};
