import scaffoldConfig from "@scaffold-eth-stark/core/stark/scaffold.config";
import { contracts } from "@scaffold-eth-stark/core/stark/utils/scaffold-stark/contract";

export function getAllContracts() {
  const contractsData = contracts?.[scaffoldConfig.targetNetworks[0].network];
  return contractsData ? contractsData : {};
}
