"use client";

import React, { useEffect, useState } from "react";
import { Footer } from "@scaffold-stark-2/components/Footer";
import { Header } from "@scaffold-stark-2/components/Header";
import { ProgressBar } from "@scaffold-stark-2/components/scaffold-stark/ProgressBar";
import { useNativeCurrencyPrice } from "@scaffold-stark-2/hooks/scaffold-stark/useNativeCurrencyPrice";
import { appChains, connectors } from "@scaffold-stark-2/services/web3/connectors";
import provider from "@scaffold-stark-2/services/web3/provider";
import { StarknetConfig, starkscan } from "@starknet-react/core";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
  useNativeCurrencyPrice();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  return (
    <>
      <div className="flex relative flex-col min-h-screen bg-main">
        {isDarkMode ? (
          <>
            <div className="circle-gradient-dark w-[330px] h-[330px]"></div>
            <div className="circle-gradient-blue-dark w-[330px] h-[330px]"></div>
          </>
        ) : (
          <>
            <div className="circle-gradient w-[330px] h-[330px]"></div>
            <div className="circle-gradient-blue w-[330px] h-[630px]"></div>
          </>
        )}
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const ScaffoldStarkAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <StarknetConfig chains={appChains} provider={provider} connectors={connectors} explorer={starkscan}>
      <ProgressBar />
      <ScaffoldStarkApp>{children}</ScaffoldStarkApp>
    </StarknetConfig>
  );
};
