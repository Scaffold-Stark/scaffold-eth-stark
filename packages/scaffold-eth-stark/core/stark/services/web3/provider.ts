import scaffoldConfig from "@scaffold-eth-stark/core/stark/scaffold.config";
import * as chains from "@starknet-react/chains";
import { jsonRpcProvider, publicProvider, starknetChainId } from "@starknet-react/core";

const containsDevnet = (networks: readonly chains.Chain[]) => {
  console.log(networks.filter(it => it.id == chains.devnet.id).length > 0);
  return networks.filter(it => it.id == chains.devnet.id).length > 0;
};

const provider =
  scaffoldConfig.rpcProviderUrl == "" || containsDevnet(scaffoldConfig.targetNetworks)
    ? publicProvider()
    : jsonRpcProvider({
        rpc: () => ({
          nodeUrl: scaffoldConfig.rpcProviderUrl,
          chainId: starknetChainId(scaffoldConfig.targetNetworks[0].id),
        }),
      });

export default provider;