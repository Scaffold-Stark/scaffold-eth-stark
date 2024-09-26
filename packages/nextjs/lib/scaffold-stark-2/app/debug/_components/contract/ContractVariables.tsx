import { DisplayVariable } from "./DisplayVariable";
import {
  AbiFunction,
  Contract,
  ContractName,
  GenericContract,
  InheritedFunctions,
  getFunctionsByStateMutability,
} from "@scaffold-stark-2/utils/scaffold-stark/contract";
import { Abi } from "abi-wan-kanabi";

export const ContractVariables = ({
  refreshDisplayVariables,
  deployedContractData,
}: {
  refreshDisplayVariables: boolean;
  deployedContractData: Contract<ContractName>;
}) => {
  if (!deployedContractData) {
    return null;
  }

  const functionsToDisplay = getFunctionsByStateMutability((deployedContractData.abi || []) as Abi, "view")
    .filter(fn => {
      const isQueryableWithParams = fn.inputs.length === 0;
      return isQueryableWithParams;
    })
    .map(fn => {
      return {
        fn,
      };
    });
  if (!functionsToDisplay.length) {
    return <>No contract variables</>;
  }

  return (
    <>
      {functionsToDisplay.map(({ fn }) => (
        <DisplayVariable
          abi={deployedContractData.abi as Abi}
          abiFunction={fn}
          contractAddress={deployedContractData.address}
          key={fn.name}
          refreshDisplayVariables={refreshDisplayVariables}
          //   inheritedFrom={inheritedFrom}
        />
      ))}
    </>
  );
};
