"use client";

import React, { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useDynamicAccount } from "~~/core/dynamic/hooks/useDynamicAccount";
import { useDynamicContract } from "~~/core/dynamic/hooks/useDynamicContract";
import { useDynamicDeployContract } from "~~/core/dynamic/hooks/useDynamicDeployContract";
import { useDynamicEventHistory } from "~~/core/dynamic/hooks/useDynamicEventHistory";
import { useDynamicReadContract } from "~~/core/dynamic/hooks/useDynamicReadContract";
import { useDynamicTargetNetwork } from "~~/core/dynamic/hooks/useDynamicTargetNetwork";
import { useDynamicTransactor } from "~~/core/dynamic/hooks/useDynamicTransactor";
import { useDynamicWriteContract } from "~~/core/dynamic/hooks/useDynamicWriteContract";
import { useGlobalState } from "~~/core/dynamic/services/store/global";
import { ChainType } from "~~/core/dynamic/types/chains";

const Home = () => {
  const currentChain = useGlobalState(state => state.currentChain);
  const { address } = useDynamicAccount();
  const { targetNetwork } = useDynamicTargetNetwork({ currentChain: currentChain });
  const [greetingState, setGreetingState] = useState("");
  const {
    data: contractData,
    isLoading: contractLoading,
    error: contractError,
  } = useDynamicContract({ contractName: "YourContract", currentChain: currentChain });
  const {
    data: deployedContractInfo,
    isLoading: deployedContractLoading,
    error: deployedContractError,
  } = useDynamicDeployContract({ contractName: "YourContract", currentChain: currentChain });
  const { data: eventHistoryData } = useDynamicEventHistory({
    contractName: "YourContract",
    eventName: "contracts::YourContract::YourContract::GreetingChanged",
    fromBlock: 1n,
    enabled: true,
    watch: true,
    currentChain: currentChain,
  });
  const {
    isLoading: isGreetingLoading,
    data: greeting,
    refetch: refetchGreeting,
  } = useDynamicReadContract({
    strk: { contractName: "YourContract", functionName: "greeting", args: [] },
    eth: { contractName: "YourContract", functionName: "greeting", args: [] },
  });

  const { ethereumTransactor, starknetTransactor } = useDynamicTransactor();

  const handleTransaction = async () => {
    if (currentChain === ChainType.Ethereum) {
      try {
        const txHash = await ethereumTransactor({
          to: address,
          account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          value: parseEther("1"),
        });
        console.log("Ethereum Transaction Hash:", txHash);
      } catch (err) {
        console.error("Ethereum transaction failed:", err);
      }
    } else if (currentChain === ChainType.Starknet) {
      try {
        const txHash = await starknetTransactor(() => {
          return Promise.resolve("Your StarkNet Transaction Hash");
        });
        console.log("Starknet Transaction Hash:", txHash);
      } catch (error) {
        console.error("Starknet transaction failed:", error);
      }
    } else {
      console.log(`Do not support your network : ${currentChain}`);
    }
  };

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
    <div className="text-white">
      <h1 className="text-3xl text-center mt-10">Starknet and EVM chains playground</h1>
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
            <tr>
              <td className="font-bold max-w-[200px]">Contract address</td>
              <td>
                {!contractError ? <div>{contractLoading ? "Loading..." : contractData?.address}</div> : contractError}
              </td>
            </tr>
            <tr>
              <td className="font-bold max-w-[200px]">Deployed contract info</td>
              <td>
                {!deployedContractError ? (
                  <div>{deployedContractLoading ? "Loading..." : deployedContractInfo?.address}</div>
                ) : (
                  deployedContractError
                )}
              </td>
            </tr>
            <tr>
              <td className="font-bold max-w-[200px]">First Event history info block hash</td>
              <td>{eventHistoryData && eventHistoryData[0]?.blockHash}</td>
            </tr>
          </tbody>
        </table>
        <button onClick={handleTransaction} className="mt-5 rounded-full bg-slate-500 px-4 py-2 text-white">
          Transaction Dynamic Hook
        </button>
        {/* input for greeting */}

        <input
          className="mt-5 input input-bordered w-fit text-black"
          type="text"
          value={greetingState}
          onChange={handleGreetingChange}
        />
        {greetingPending ? (
          <div>Loading...</div>
        ) : (
          <div
            className="mt-3 bg-green-100 text-black rounded-full w-fit px-5 py-1 cursor-pointer"
            onClick={handleClick}
          >
            Click me to change greeting
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
