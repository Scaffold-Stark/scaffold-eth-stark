"use client";

import Image from "next/image";
import Logo from "../public/logo.svg";
import { CollateralIcon } from "./icons/CollateralIcon";
import { DashboardIcon } from "./icons/Dashboard";
import { DocsIcon } from "./icons/Docs";
import { ExplorerIcon } from "./icons/ExplorerIcon";
import { LoanRequestIcon } from "./icons/LoanRequestIcon";
import { MarketIcon } from "./icons/MarketIcon";
import SelectNetWorkModal from "./modals/SelectNetworkModal";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import { useGlobalState } from "~~/core/dynamic/services/store/global";
import { ChainType } from "~~/core/dynamic/types/chains";

const listMenu = [
  {
    title: "Explorer",
    icon: <ExplorerIcon />,
  },
  {
    title: "Market",
    icon: <MarketIcon />,
  },
  {
    title: "Collateral",
    icon: <CollateralIcon />,
  },
  {
    title: "Loan Requests",
    icon: <LoanRequestIcon />,
  },
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Docs",
    icon: <DocsIcon />,
  },
];

export const Header = () => {
  const currentChain = useGlobalState(state => state.currentChain);

  return (
    <div className="header">
      <div className="content mx-auto">
        <div className="flex items-center">
          <div className="flex items-center gap-5">
            <Image src={Logo} alt="logo" loading="lazy" width={35} height={60} className="cursor-pointer" />
            <div className="flex items-center ">
              {listMenu.map(item => (
                <div key={item?.title} className="flex items-center gap-3 mx-3 cursor-pointer">
                  {item?.icon}
                  <p>{item?.title}</p>
                </div>
              ))}
            </div>
          </div>
          {/* <p className="text-red-800"> {currentChain}</p> */}
          <div className="flex-1">
            <div className="w-full flex justify-end gap-3">
              <SelectNetWorkModal />
              {currentChain == ChainType.Ethereum ? <RainbowKitCustomConnectButton /> : <CustomConnectButton />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
