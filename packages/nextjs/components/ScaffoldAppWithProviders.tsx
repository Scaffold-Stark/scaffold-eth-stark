"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { BlockieAvatar } from "@scaffold-eth-2/components/scaffold-eth";
import { useInitializeNativeCurrencyPrice } from "@scaffold-eth-2/hooks/scaffold-eth";
import { useGlobalState as useEthGlobalState } from "@scaffold-eth-2/services/store/store";
import { wagmiConfig } from "@scaffold-eth-2/services/web3/wagmiConfig";
import { ChainWithAttributes } from "@scaffold-eth-2/utils/scaffold-eth";
import { useNativeCurrencyPrice } from "@scaffold-stark-2/hooks/scaffold-stark/useNativeCurrencyPrice";
import { appChains, connectors } from "@scaffold-stark-2/services/web3/connectors";
import provider from "@scaffold-stark-2/services/web3/provider";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import { WagmiProvider } from "wagmi";
import { useChainId } from "wagmi";
import { Header } from "~~/components/Header";
import { useGlobalState } from "~~/dynamic/services/store/global";
import { ChainType } from "~~/dynamic/types/chains";

const ScaffoldMultichainApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();
  useNativeCurrencyPrice();
  const setTargetNetwork = useEthGlobalState(state => state.setTargetNetwork);

  const chainId = useChainId();
  const [lastSelectedChain, setLastSelectedChain] = useLocalStorage<string>("lastSelectedChain", "");
  const [lastEVMChain, setLastEVMChain] = useLocalStorage<ChainWithAttributes | null>("lastEVMChain", null);
  const setCurrentChain = useGlobalState(state => state.setCurrentChain);

  useEffect(() => {
    if (!lastSelectedChain) {
      setCurrentChain(ChainType.Ethereum);
      setLastSelectedChain(ChainType.Ethereum);
    } else {
      // check if last selected chain is evm chain, then need to set last evm chain
      if (lastSelectedChain == ChainType.Ethereum) {
        if (lastEVMChain) {
          setTargetNetwork(lastEVMChain);
          setLastEVMChain(lastEVMChain);
        }
      }
      setCurrentChain(lastSelectedChain);
    }
  }, [lastSelectedChain, chainId]);

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
  const [lastEVMChain, setLastEVMChain] = useLocalStorage<ChainWithAttributes | null>("lastEVMChain", null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div></div>;

  return (
    <StarknetConfig chains={appChains} provider={provider} connectors={connectors} explorer={starkscan}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            avatar={BlockieAvatar}
            theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
            initialChain={lastEVMChain ? lastEVMChain.id : undefined}
          >
            <ScaffoldMultichainApp>{children}</ScaffoldMultichainApp>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StarknetConfig>
  );
};
