import { useEffect, useState } from "react";
import Image from "next/image";
import EthNetwork from "../../public/networks/eth-network-icon.svg";
import StrkNetwork from "../../public/networks/strk-network-icon.svg";
import GenericModal from "./scaffold-stark/CustomConnectButton/GenericModal";
import { useTargetNetwork } from "@scaffold-eth-2/hooks/scaffold-eth";
import { useGlobalState as useEthGlobalState } from "@scaffold-eth-2/services/store/store";
import { ChainWithAttributes, getTargetNetworks } from "@scaffold-eth-2/utils/scaffold-eth";
import { useLocalStorage } from "usehooks-ts";
import { useAccount, useSwitchChain } from "wagmi";
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
  const {
    switchChain,
    isPending: isSwitchingChain,
    isError: isSwitchingError,
    isSuccess: isSwitchingSuccess,
  } = useSwitchChain();
  const { isConnected: isEVMConnected } = useAccount();
  const { currentChain, setLastEVMChain: setLastEVMChainGlobalState } = useGlobalState(state => state);
  const { setCurrentChain, setSwitchNetworkModalOpen, switchNetworkModalOpen } = useGlobalState(state => state);

  const [animate, setAnimate] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<string>("");
  const [ethActiveNetwork, setEthActiveNetwork] = useState<ChainWithAttributes | null>(null);

  const [lastSelectedChain, setLastSelectedChain] = useLocalStorage<string>("lastSelectedChain", "");
  const [_, setLastEVMChain] = useLocalStorage<ChainWithAttributes | null>("lastEVMChain", null);

  const { targetNetwork: evmTargetNetwork } = useTargetNetwork();
  const setTargetNetwork = useEthGlobalState(state => state.setTargetNetwork);

  const evmTargetNetworks = getTargetNetworks();

  useEffect(() => {
    setActiveNetwork(currentChain);

    if (lastSelectedChain == ChainType.Starknet && currentChain == ChainType.Ethereum) {
      if (!isSwitchingChain) {
        if (isSwitchingError) {
          setLastSelectedChain(ChainType.Starknet);
          setCurrentChain(ChainType.Starknet);
          setActiveNetwork(ChainType.Starknet);
        } else {
          setCurrentChain(ChainType.Ethereum);
          setLastSelectedChain(ChainType.Ethereum);
          setActiveNetwork(ChainType.Ethereum);
        }
      }
    } else if (lastSelectedChain == ChainType.Ethereum && currentChain == ChainType.Ethereum) {
      if (!isSwitchingChain) {
        setEthActiveNetwork(evmTargetNetwork);
      }
      if (isSwitchingError) {
        setEthActiveNetwork(evmTargetNetwork);
      }
      if (isSwitchingSuccess) {
        setCurrentChain(ChainType.Ethereum);
        setLastSelectedChain(ChainType.Ethereum);
        setActiveNetwork(ChainType.Ethereum);
        setEthActiveNetwork(evmTargetNetwork);
      }
    }
  }, [currentChain, evmTargetNetwork, isSwitchingError, isSwitchingSuccess]);

  useEffect(() => setAnimate(switchNetworkModalOpen), [switchNetworkModalOpen]);

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnimate(false);
    setTimeout(() => {
      setSwitchNetworkModalOpen(false);
    }, 400);
  };

  const handleEthereumNetworkClick = async (network: ChainWithAttributes) => {
    setEthActiveNetwork(network);
    setCurrentChain(ChainType.Ethereum);
    if (isEVMConnected) {
      await switchChain?.({ chainId: network.id });
    }
    setTargetNetwork(network);
    setLastEVMChain(network);
    setLastEVMChainGlobalState(network);

    setAnimate(false);
    setTimeout(() => {
      setSwitchNetworkModalOpen(false);
    }, 400);
  };

  const handleStarknetClick = () => {
    setLastSelectedChain(ChainType.Starknet);
    setCurrentChain(ChainType.Starknet);
    setAnimate(false);
    setTimeout(() => {
      setSwitchNetworkModalOpen(false);
    }, 400);
  };

  return (
    <>
      <div
        className="flex items-center justify-between cursor-pointer rounded bg-[#1C1F28] py-1 px-4 h-[40px] w-[80px]"
        onClick={() => setSwitchNetworkModalOpen(true)}
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
        isOpen={switchNetworkModalOpen}
        animate={animate}
        onClose={closeModal}
        className="bg-modal-network w-fit p-6 rounded-lg"
      >
        <p className="text-2xl font-bold text-white">Connect Network</p>
        <p className="text-sm text-white">Choose your network to connect wallet</p>
        <div className="flex items-center gap-4 mt-4">
          {/* this side are all ethereum */}
          <div className="flex gap-4">
            {evmTargetNetworks &&
              evmTargetNetworks.map(network => (
                <div
                  key={network.id}
                  onClick={() => handleEthereumNetworkClick(network)}
                  className={`network  ${
                    activeNetwork === ChainType.Ethereum
                      ? ethActiveNetwork?.id === network.id
                        ? "active-network"
                        : "bg-network"
                      : "bg-network"
                  }`}
                >
                  <Image src={EthNetwork} alt="Ethereum Network" loading="lazy" width={50} height={50} />
                  <p className="uppercase mt-2">{network.name}</p>
                </div>
              ))}
          </div>
          <div
            onClick={handleStarknetClick}
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
