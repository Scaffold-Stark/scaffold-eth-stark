"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { Header } from "@scaffold-eth-stark/components/Header";
import { BlockieAvatar } from "@scaffold-eth-stark/components/scaffold-eth";
import { useGlobalState } from "@scaffold-eth-stark/core/dynamic/services/store/global";
import { ChainType } from "@scaffold-eth-stark/core/dynamic/types/chains";
import { useNativeCurrencyPrice } from "@scaffold-eth-stark/core/stark/hooks/useNativeCurrencyPrice";
import { appChains, connectors } from "@scaffold-eth-stark/core/stark/services/web3/connectors";
import provider from "@scaffold-eth-stark/core/stark/services/web3/provider";
import { useInitializeNativeCurrencyPrice } from "@scaffold-eth/hooks/scaffold-eth";
import { wagmiConfig } from "@scaffold-eth/services/web3/wagmiConfig";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import { WagmiProvider } from "wagmi";

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
