import React, { useEffect, useState } from "react";
import { BlockieAvatar } from "../BlockieAvatar";
import GenericModal from "./GenericModal";
import { BurnerConnector } from "@scaffold-stark-2/services/web3/stark-burner/BurnerConnector";
import { LAST_CONNECTED_TIME_LOCALSTORAGE_KEY } from "@scaffold-stark-2/utils/Constants";
import { burnerAccounts } from "@scaffold-stark-2/utils/devnetAccounts";
import { Connector, useConnect } from "@starknet-react/core";
import { useTheme } from "next-themes";
import { useLocalStorage } from "usehooks-ts";
import Wallet from "~~/components/Wallet/scaffold-stark/CustomConnectButton/Wallet";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const loader = ({ src }: { src: string }) => {
  return src;
};

const ConnectModal = ({ isOpen, onClose }: Props) => {
  const [animate, setAnimate] = useState(false);
  const [isBurnerWallet, setIsBurnerWallet] = useState(false);

  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 400);
    setIsBurnerWallet(false);
  };

  useEffect(() => setAnimate(isOpen), [isOpen]);

  const { connectors, connect } = useConnect();

  const [_, setLastConnector] = useLocalStorage<{ id: string; ix?: number }>(
    "lastUsedConnector",
    { id: "" },
    {
      initializeWithValue: false,
    },
  );
  const [, setLastConnectionTime] = useLocalStorage<number>(LAST_CONNECTED_TIME_LOCALSTORAGE_KEY, 0);

  function handleConnectWallet(e: React.MouseEvent<HTMLButtonElement>, connector: Connector): void {
    if (connector.id === "burner-wallet") {
      setIsBurnerWallet(true);
      return;
    }

    connect({ connector });
    setLastConnector({ id: connector.id });
    setLastConnectionTime(Date.now());
    closeModal(e);
  }

  function handleConnectBurner(e: React.MouseEvent<HTMLButtonElement>, ix: number) {
    const connector = connectors.find(it => it.id == "burner-wallet") as BurnerConnector;
    if (connector) {
      connector.burnerAccount = burnerAccounts[ix];
      connect({ connector });
      setLastConnector({ id: connector.id, ix });
      setLastConnectionTime(Date.now());
      closeModal(e);
    }
  }

  const sortedConnectors = connectors.sort((a, b) => {
    if (a.name.includes("Argent") && !b.name.includes("Argent")) {
      return -1;
    }
    if (b.name.includes("Argent") && !a.name.includes("Argent")) {
      return 1;
    }
    if (a.name.includes("Braavos") && !b.name.includes("Braavos")) {
      return -1;
    }
    if (b.name.includes("Braavos") && !a.name.includes("Braavos")) {
      return 1;
    }
    return 0;
  });
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={closeModal}
      animate={animate}
      className={`mx-auto border border-gray-600 p-[30px] bg-[#14161d]`}
    >
      {isBurnerWallet ? (
        <h2 className="text-white text-[24px] text-center">Choose account</h2>
      ) : (
        <h2 className="text-white text-[24px] text-left mb-5">Connect Wallet</h2>
      )}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          {!isBurnerWallet ? (
            sortedConnectors.map((connector, index) => (
              <Wallet
                key={connector.id || index}
                connector={connector}
                loader={loader}
                handleConnectWallet={handleConnectWallet}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 mx-8 pb-10 pt-8">
              <div className="h-[300px] overflow-y-auto flex w-full flex-col gap-4">
                {burnerAccounts.map((burnerAcc, ix) => (
                  <div key={burnerAcc.publicKey} className="w-full flex flex-col">
                    <button
                      className={`text-white border border-gray-600 rounded-md  py-[8px] pl-[10px] pr-16 flex items-center gap-4 bg-[#14161d]
                                  hover:text-black hover:bg-white
                                  `}
                      onClick={e => handleConnectBurner(e, ix)}
                    >
                      <BlockieAvatar address={burnerAcc.accountAddress} size={35}></BlockieAvatar>
                      {`${burnerAcc.accountAddress.slice(0, 6)}...${burnerAcc.accountAddress.slice(-4)}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GenericModal>
  );
};

export default ConnectModal;
