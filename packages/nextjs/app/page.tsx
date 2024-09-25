"use client";

import React, { useEffect, useState } from "react";
import { useDynamicAccount } from "~~/core/dynamic/hooks/useDynamicAccount";
import { useDynamicEventHistory } from "~~/core/dynamic/hooks/useDynamicEventHistory";
import { useDynamicReadContract } from "~~/core/dynamic/hooks/useDynamicReadContract";
import { useDynamicTargetNetwork } from "~~/core/dynamic/hooks/useDynamicTargetNetwork";
import { useDynamicWriteContract } from "~~/core/dynamic/hooks/useDynamicWriteContract";
import { useGlobalState } from "~~/core/dynamic/services/store/global";
import { useScaffoldEventHistory } from "~~/core/eth/hooks";


const Home = () => {
  const currentChain = useGlobalState(state => state.currentChain);
  const { address } = useDynamicAccount();
  const { targetNetwork } = useDynamicTargetNetwork({ currentChain: currentChain })
  const [greetingState, setGreetingState] = useState("");
  
  const {
    isLoading: isGreetingLoading,
    data: greeting,
    refetch: refetchGreeting,
  } = useDynamicReadContract({
    strk: { contractName: "YourContract", functionName: "greeting", args: [] },
    eth: { contractName: "YourContract", functionName: "greeting", args: [] },
  });

  const { writeAsync, isPending: greetingPending } = useDynamicWriteContract({
    strk: {
      contractName: "YourContract",
      functionName: "set_greeting",
      args: [greetingState, 0],
    },
    eth: {
      contractName: "YourContract",
      functionName: "setGreeting",
      args: [greetingState],
    },
  });

  async function handleClick() {
    try {
      await writeAsync();

      // after transaction successfull, we need refetch the contract data
      await refetchGreeting();
    } catch (error) {
      console.error(error);
    }
  }

  const handleGreetingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGreetingState(e.target.value);
  };

  useEffect(() => {
    setGreetingState(greeting ? greeting.toString() : "");
  }, [greeting]);

  return (
    <div>
      <h1 className="text-black text-3xl text-center mt-10">Starknet and EVM chains playground</h1>
      <div className="w-[80%] mx-auto flex justify-center items-center flex-col">
        <table className="mt-5 w-[60%] mx-auto text-left">
          <tbody>
            <tr>
              <td className="font-bold max-w-[200px]">Current chain</td>
              <td className="text-left">{currentChain}</td>
            </tr>
            <tr>
              <td className="font-bold max-w-[200px]">Current address</td>
              <td className="max-w-[400px] truncate text-left">{address}</td>
            </tr>
            <tr>
              <td className="font-bold max-w-[200px]">YourContract greeting</td>
              <td className="text-left">{isGreetingLoading ? "Loading..." : String(greeting)}</td>
            </tr>
            <tr>
              <td className="font-bold max-w-[200px]">Network</td>
              <td className="text-left">{targetNetwork?.name}</td>
            </tr>
          </tbody>
        </table>
        {/* input for greeting */}

        <input
          className="mt-5 input input-bordered w-fit"
          type="text"
          value={greetingState}
          onChange={handleGreetingChange}
        />
        {greetingPending ? (
          <div>Loading...</div>
        ) : (
          <div className="mt-3 bg-green-100 rounded-full w-fit px-5 py-1 cursor-pointer" onClick={handleClick}>
            Click me to change greeting
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
