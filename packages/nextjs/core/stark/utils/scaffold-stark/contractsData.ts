import scaffoldConfig from "~~/core/stark/scaffold.config";
import { contracts } from "~~/core/stark/utils/scaffold-stark/contract";

export function getAllContracts() {
  const contractsData = contracts?.[scaffoldConfig.targetNetworks[0].network];
  return contractsData ? contractsData : {};
}
