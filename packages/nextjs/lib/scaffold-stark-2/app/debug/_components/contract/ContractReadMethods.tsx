import { ReadOnlyFunctionForm } from "./ReadOnlyFunctionForm";
import {
  AbiFunction,
  Contract,
  ContractName,
  GenericContract,
  InheritedFunctions,
  getFunctionsByStateMutability,
} from "@scaffold-stark-2/utils/scaffold-stark/contract";
import { Abi } from "abi-wan-kanabi";

export const ContractReadMethods = ({ deployedContractData }: { deployedContractData: Contract<ContractName> }) => {
  if (!deployedContractData) {
    return null;
  }

  const functionsToDisplay = getFunctionsByStateMutability((deployedContractData.abi || []) as Abi, "view")
    .filter(fn => {
      const isQueryableWithParams = fn.inputs.length > 0;
      return isQueryableWithParams;
    })
    .map(fn => {
      return {
        fn,
      };
    });
  if (!functionsToDisplay.length) {
    return <>No read methods</>;
  }
  return (
    <>
      {functionsToDisplay.map(({ fn }) => (
        <ReadOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          contractAddress={deployedContractData.address}
          abiFunction={fn}
          key={fn.name}
        />
      ))}
    </>
  );
};
