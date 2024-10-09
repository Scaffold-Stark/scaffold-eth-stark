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
  setCurrentChain: (newSelectedChain: string) => void;
  setLastEVMChain: (newLastEVMChain: ChainWithAttributes) => void;
};

export const useGlobalState = create<GlobalState>((set: any) => ({
  currentChain: "",
  lastEVMChain: null,
  setCurrentChain: (newSelectedChain: string): void => set(() => ({ currentChain: newSelectedChain })),
  setLastEVMChain: (newLastEVMChain: ChainWithAttributes): void => set(() => ({ lastEVMChain: newLastEVMChain })),
}));
