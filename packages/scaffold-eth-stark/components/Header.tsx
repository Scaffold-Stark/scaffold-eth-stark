"use client";

import React, { useEffect, useState } from "react";
import { RainbowKitCustomConnectButton } from "@scaffold-eth-stark/components/scaffold-eth";
import { CustomConnectButton } from "@scaffold-eth-stark/components/scaffold-stark/CustomConnectButton";
import { useGlobalState } from "@scaffold-eth-stark/core/dynamic/services/store/global";
import { ChainType } from "@scaffold-eth-stark/core/dynamic/types/chains";
import { useLocalStorage } from "usehooks-ts";

export const Header = () => {
  const setCurrentChain = useGlobalState(state => state.setCurrentChain);
  const currentChain = useGlobalState(state => state.currentChain);

  const [selectedOption, setSelectedOption] = useState(ChainType.Ethereum as string);
  const [_, setLastSelectedChain] = useLocalStorage<string>("lastSelectedChain", "");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLastSelectedChain(event.target.value);
    setSelectedOption(event.target.value);
    setCurrentChain(event.target.value);
  };

  useEffect(() => {
    setSelectedOption(currentChain);
  }, [currentChain]);

  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-end">
        <p className="text-red-800"> {currentChain}</p>
        <select name="" id="" value={selectedOption} onChange={handleChange}>
          <option value={ChainType.Ethereum}>Ethereum</option>
          <option value={ChainType.Starknet}>Starknet</option>
        </select>
        {selectedOption == ChainType.Ethereum ? <RainbowKitCustomConnectButton /> : <CustomConnectButton />}
      </div>
    </div>
  );
};