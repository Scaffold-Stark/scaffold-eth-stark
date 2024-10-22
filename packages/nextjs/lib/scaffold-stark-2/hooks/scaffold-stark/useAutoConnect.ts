import { useReadLocalStorage } from "usehooks-ts";
import { useEffect } from "react";
import { useConnect } from "@starknet-react/core";
import scaffoldConfig from "@scaffold-stark-2/scaffold.config";
import type { BurnerConnector } from "@scaffold-stark-2/services/web3/stark-burner/BurnerConnector";
import { burnerAccounts } from "@scaffold-stark-2/utils/devnetAccounts";

/**
 * Automatically connect to a wallet/connector based on config and prior wallet
 */
export const useAutoConnect = (): void => {
  const savedConnector = useReadLocalStorage<{ id: string; ix?: number }>(
    "lastUsedConnector",
  );

  const lastConnectionTime = useReadLocalStorage<number>("lastConnectionTime");

  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (scaffoldConfig.walletAutoConnect) {
      const currentTime = Date.now();
      const ttlExpired =
        currentTime - (lastConnectionTime || 0) > scaffoldConfig.autoConnectTTL;
      if (!ttlExpired) {
        const connector = connectors.find(
          (conn) => conn.id == savedConnector?.id,
        );

        if (connector) {
          if (
            connector.id == "burner-wallet" &&
            savedConnector?.ix !== undefined
          ) {
            (connector as BurnerConnector).burnerAccount =
              burnerAccounts[savedConnector.ix];
          }
          connect({ connector });
        }
      }
    }
  }, [connect, connectors, savedConnector]);
};
