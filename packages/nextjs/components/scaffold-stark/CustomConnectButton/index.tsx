"use client";

// @refresh reset
import { useState } from "react";
import Image from "next/image";
import WalletIcon from "../../../public/icons/connect-wallet-icon.svg";
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import ConnectModal from "./ConnectModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { Address } from "@starknet-react/chains";
import { useAccount, useNetwork } from "@starknet-react/core";
import { useAutoConnect, useNetworkColor } from "~~/core/stark/hooks/";
import { useTargetNetwork } from "~~/core/stark/hooks/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/core/stark/utils/scaffold-stark";

/**
 * Custom Connect Button (watch balance + custom design)
 */
export const CustomConnectButton = () => {
  useAutoConnect();
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();
  const { address, status, chainId } = useAccount();
  const { chain } = useNetwork();
  const [modalOpen, setModalOpen] = useState(false);

  const blockExplorerAddressLink = address ? getBlockExplorerAddressLink(targetNetwork, address) : undefined;

  const handleWalletConnect = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return status == "disconnected" ? (
    <>
      <div className="btn-connect-wallet" onClick={handleWalletConnect}>
        <p>Connect</p>
        <Image src={WalletIcon} alt="wallet-icon" height={15} width={15} />
      </div>
      <ConnectModal isOpen={modalOpen} onClose={handleModalClose} />
    </>
  ) : chainId !== targetNetwork.id ? (
    <WrongNetworkDropdown />
  ) : (
    <>
      <div className="flex flex-col items-center mr-1">
        <Balance address={address as Address} className="min-h-0 h-auto" />
        <span className="text-xs" style={{ color: networkColor }}>
          {chain.name}
        </span>
      </div>
      <AddressInfoDropdown
        address={address as Address}
        displayName={""}
        ensAvatar={""}
        blockExplorerAddressLink={blockExplorerAddressLink}
      />
      <AddressQRCodeModal address={address as Address} modalId="qrcode-modal" />
    </>
  );
};
