"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import { WagmiProvider } from "wagmi";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useGlobalState } from "~~/core/dynamic/services/store/global";
import { ChainType } from "~~/core/dynamic/types/chains";
import { useInitializeNativeCurrencyPrice } from "~~/core/eth/hooks";
import { wagmiConfig } from "~~/core/eth/services/web3/wagmiConfig";
import { useNativeCurrencyPrice } from "~~/core/stark/hooks/useNativeCurrencyPrice";
import { appChains, connectors } from "~~/core/stark/services/web3/connectors";
import provider from "~~/core/stark/services/web3/provider";

const ScaffoldCrossChainApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();
  useNativeCurrencyPrice();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);
  const setCurrentChain = useGlobalState(state => state.setCurrentChain);
  const [lastSelectedChain, setLastSelectedChain] = useLocalStorage<string>("lastSelectedChain", "");

  useEffect(() => {
    setMounted(true);

    if (mounted) {
      if (!lastSelectedChain) {
        setCurrentChain(ChainType.Ethereum);
        setLastSelectedChain(ChainType.Ethereum);
      } else {
        setCurrentChain(lastSelectedChain);
      }
    }
  }, [mounted, lastSelectedChain, setCurrentChain, setLastSelectedChain]);

  return (
    <StarknetConfig chains={appChains} provider={provider} connectors={connectors} explorer={starkscan}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            avatar={BlockieAvatar}
            theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
          >
            <ScaffoldCrossChainApp>{children}</ScaffoldCrossChainApp>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StarknetConfig>
  );
};
