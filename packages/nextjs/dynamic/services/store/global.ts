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
  setCurrentChain: (newSelectedChain: string) => void;
};

export const useGlobalState = create<GlobalState>((set: any) => ({
  currentChain: "",
  setCurrentChain: (newSelectedChain: string): void => set(() => ({ currentChain: newSelectedChain })),
}));
