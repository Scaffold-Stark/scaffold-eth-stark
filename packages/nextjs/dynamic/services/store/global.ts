import { ChainWithAttributes } from "@scaffold-eth-2/utils/scaffold-eth";
import { create } from "zustand";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

export type GlobalState = {
  currentChain: string;
  lastEVMChain: ChainWithAttributes | null;
  switchNetworkModalOpen: boolean;
  setCurrentChain: (newSelectedChain: string) => void;
  setLastEVMChain: (newLastEVMChain: ChainWithAttributes) => void;
  setSwitchNetworkModalOpen: (newSwitchNetworkModalOpen: boolean) => void;
};

export const useGlobalState = create<GlobalState>((set: any) => ({
  currentChain: "",
  lastEVMChain: null,
  switchNetworkModalOpen: false,
  setCurrentChain: (newSelectedChain: string): void => set(() => ({ currentChain: newSelectedChain })),
  setLastEVMChain: (newLastEVMChain: ChainWithAttributes): void => set(() => ({ lastEVMChain: newLastEVMChain })),
  setSwitchNetworkModalOpen: (newSwitchNetworkModalOpen: boolean): void =>
    set(() => ({ switchNetworkModalOpen: newSwitchNetworkModalOpen })),
}));
