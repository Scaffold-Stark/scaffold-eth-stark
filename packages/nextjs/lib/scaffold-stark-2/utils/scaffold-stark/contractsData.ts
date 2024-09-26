import scaffoldConfig from "@scaffold-stark-2/scaffold.config";
import { contracts } from "@scaffold-stark-2/utils/scaffold-stark/contract";

export function getAllContracts() {
  const contractsData = contracts?.[scaffoldConfig.targetNetworks[0].network];
  return contractsData ? contractsData : {};
}
