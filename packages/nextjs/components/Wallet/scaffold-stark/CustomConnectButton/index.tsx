"use client";

// @refresh reset
import { useEffect, useState } from "react";
import Image from "next/image";
import WalletIcon from "../../../../public/icons/connect-wallet-icon.svg";
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import ConnectModal from "./ConnectModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useAutoConnect, useNetworkColor } from "@scaffold-stark-2/hooks/scaffold-stark";
import { useTargetNetwork } from "@scaffold-stark-2/hooks/scaffold-stark/useTargetNetwork";
import { getBlockExplorerAddressLink } from "@scaffold-stark-2/utils/scaffold-stark";
import { Address } from "@starknet-react/chains";
import { useAccount, useNetwork } from "@starknet-react/core";
import { useGlobalState } from "~~/dynamic/services/store/global";
import { ChainType } from "~~/dynamic/types/chains";

/**
 * Custom Connect Button (watch balance + custom design)
 */
export const CustomConnectButton = () => {
  const currentChain = useGlobalState(state => state.currentChain);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentChain !== undefined) {
      setIsLoading(false);
    }
  }, [currentChain]);

  if (isLoading) {
    return (
      <div className="btn-connect-wallet">
        <p>Connect</p>
        <Image src={WalletIcon} alt="wallet-icon" height={15} width={15} />
      </div>
    ); // or return a loading indicator
  }

  if (currentChain === ChainType.Ethereum || currentChain == "" || currentChain == null || currentChain == undefined) {
    return null;
  } else {
    return <CustomConnectButtonStarknet />;
  }
};

export const CustomConnectButtonStarknet = () => {
  useAutoConnect();

  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();
  const { account, status, address: accountAddress } = useAccount();
  const [accountChainId, setAccountChainId] = useState<bigint>(0n);
  const { chain } = useNetwork();
  const [modalOpen, setModalOpen] = useState(false);

  const blockExplorerAddressLink = accountAddress
    ? getBlockExplorerAddressLink(targetNetwork, accountAddress)
    : undefined;

  const handleWalletConnect = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  // effect to get chain id and address from account
  useEffect(() => {
    if (account) {
      const getChainId = async () => {
        const chainId = await account.channel.getChainId();
        setAccountChainId(BigInt(chainId as string));
      };

      getChainId();
    }
  }, [account]);

  if (status === "disconnected")
    return (
      <>
        <div className="btn-connect-wallet" onClick={handleWalletConnect}>
          <p>Connect</p>
          <Image src={WalletIcon} alt="wallet-icon" height={15} width={15} />
        </div>
        <ConnectModal isOpen={modalOpen} onClose={handleModalClose} />
      </>
    );

  if (accountChainId !== targetNetwork.id) {
    return <WrongNetworkDropdown />;
  }

  return (
    <>
      <div className="flex flex-col items-center mr-1">
        <Balance address={accountAddress as Address} className="min-h-0 h-auto" />
        <span className="text-xs" style={{ color: networkColor }}>
          {chain.name}
        </span>
      </div>
      <AddressInfoDropdown
        address={accountAddress as Address}
        displayName={""}
        ensAvatar={""}
        blockExplorerAddressLink={blockExplorerAddressLink}
      />
      <AddressQRCodeModal address={accountAddress as Address} modalId="qrcode-modal" />
    </>
  );
};
