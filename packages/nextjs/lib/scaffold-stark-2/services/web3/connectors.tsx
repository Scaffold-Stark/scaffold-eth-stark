import { BurnerConnector } from "./stark-burner/BurnerConnector";
import scaffoldConfig from "@scaffold-stark-2/scaffold.config";
import { LAST_CONNECTED_TIME_LOCALSTORAGE_KEY } from "@scaffold-stark-2/utils/Constants";
import { getTargetNetworks } from "@scaffold-stark-2/utils/scaffold-stark";
import { InjectedConnector, argent, braavos } from "@starknet-react/core";

const targetNetworks = getTargetNetworks();

export const connectors = getConnectors();

// workaround helper function to properly disconnect with removing local storage (prevent autoconnect infinite loop)
function withDisconnectWrapper(connector: InjectedConnector) {
  const connectorDisconnect = connector.disconnect;
  const _disconnect = (): Promise<void> => {
    localStorage.removeItem("lastUsedConnector");
    localStorage.removeItem(LAST_CONNECTED_TIME_LOCALSTORAGE_KEY);
    return connectorDisconnect();
  };
  connector.disconnect = _disconnect.bind(connector);
  return connector;
}

function getConnectors() {
  const { targetNetworks } = scaffoldConfig;

  const connectors = [argent(), braavos()];

  if (targetNetworks.some(network => (network.network as string) === "devnet")) {
    connectors.push(new BurnerConnector());
  }

  return connectors.sort(() => Math.random() - 0.5).map(withDisconnectWrapper);
}

export const appChains = targetNetworks;
