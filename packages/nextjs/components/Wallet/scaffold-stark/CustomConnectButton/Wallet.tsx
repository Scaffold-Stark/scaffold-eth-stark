import React, { useState } from "react";
import Image from "next/image";
import { Connector } from "@starknet-react/core";
import { useTheme } from "next-themes";

const Wallet = ({
  handleConnectWallet,
  connector,
  loader,
}: {
  connector: Connector;
  loader: ({ src }: { src: string }) => string;
  handleConnectWallet: (e: React.MouseEvent<HTMLButtonElement>, connector: Connector) => void;
}) => {
  const iconLight = typeof connector.icon === "object" ? connector.icon.light : connector.icon;
  const isSvg = iconLight.startsWith("<svg");
  const [clicked, setClicked] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <button
      className="bg-modal-network network w-[145px] h-[145px]"
      onClick={e => {
        setClicked(true);
        handleConnectWallet(e, connector);
      }}
    >
      <div>
        {isSvg ? (
          <div
            dangerouslySetInnerHTML={{
              __html: typeof connector.icon === "string" ? connector.icon : connector.icon.light ?? "",
            }}
          />
        ) : (
          <Image
            alt={connector.name}
            loader={loader}
            src={typeof connector.icon === "object" ? connector.icon.light : connector.icon ?? ""}
            width={50}
            height={50}
          />
        )}
      </div>
      <p className="text-center">{connector.name}</p>
    </button>
  );
};

export default Wallet;
