"use client";

import SelectNetWorkModal from "./modals/SelectNetworkModal";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import { useGlobalState } from "~~/dynamic/services/store/global";
import { ChainType } from "~~/dynamic/types/chains";

export const Header = () => {
  const currentChain = useGlobalState(state => state.currentChain);

  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-end gap-3">
        <SelectNetWorkModal />
        {currentChain == ChainType.Ethereum ? <RainbowKitCustomConnectButton /> : <CustomConnectButton />}
      </div>
    </div>
  );
};
