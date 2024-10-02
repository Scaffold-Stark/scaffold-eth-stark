import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import EthNetwork from "../../public/icons/eth-network-icon.svg";
import StrkNetwork from "../../public/icons/strk-network-icon.svg";
import GenericModal from "./scaffold-stark/CustomConnectButton/GenericModal";
import { useLocalStorage } from "usehooks-ts";
import { useGlobalState } from "~~/dynamic/services/store/global";
import { ChainType } from "~~/dynamic/types/chains";

const ArrowDownIcon = ({ color }: { color: string }) => {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default function SelectNetWorkModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [animate, setAnimate] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<string>("");
  const currentChain = useGlobalState(state => state.currentChain);
  const setCurrentChain = useGlobalState(state => state.setCurrentChain);
  const [_, setLastSelectedChain] = useLocalStorage<string>("lastSelectedChain", "");

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnimate(false);
    setTimeout(() => {
      setOpen(false);
    }, 400);
  };

  useEffect(() => {
    setActiveNetwork(currentChain);
  }, [currentChain]);
  useEffect(() => setAnimate(open), [open]);

  return (
    <>
      <div
        className="flex items-center justify-between cursor-pointer rounded bg-[#1C1F28] py-1 px-4 h-[40px] w-[80px]"
        onClick={() => setOpen(true)}
      >
        <Image
          src={activeNetwork === ChainType.Ethereum ? EthNetwork : StrkNetwork}
          alt="network-icon"
          loading="lazy"
          width={22}
          height={22}
          className="max-h-[22px]"
        />
        <ArrowDownIcon color="#676F8E" />
      </div>

      <GenericModal
        isOpen={open}
        animate={animate}
        onClose={closeModal}
        className="bg-modal-network w-fit p-6 rounded-lg"
      >
        <p className="text-2xl font-bold text-white">Connect Network</p>
        <p className="text-sm text-white">Choose your network to connect wallet</p>
        <div className="flex items-center gap-4 mt-4">
          <div
            onClick={() => {
              setActiveNetwork(ChainType.Ethereum);
              setLastSelectedChain(ChainType.Ethereum);
              setCurrentChain(ChainType.Ethereum);
            }}
            className={`network  ${activeNetwork === ChainType.Ethereum ? "active-network" : "bg-network"}`}
          >
            <Image src={EthNetwork} alt="Ethereum Network" loading="lazy" width={50} height={50} />
            <p className="uppercase mt-2">Ethereum</p>
          </div>
          <div
            onClick={() => {
              setActiveNetwork(ChainType.Starknet);
              setLastSelectedChain(ChainType.Starknet);
              setCurrentChain(ChainType.Starknet);
            }}
            className={`network ${activeNetwork === ChainType.Starknet ? "active-network" : "bg-network"}`}
          >
            <Image src={StrkNetwork} alt="StarkNet Network" loading="lazy" width={50} height={50} />
            <p className="uppercase mt-2">StarkNet</p>
          </div>
        </div>
      </GenericModal>
    </>
  );
}
