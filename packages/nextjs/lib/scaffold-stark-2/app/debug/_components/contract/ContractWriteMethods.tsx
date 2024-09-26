import { WriteOnlyFunctionForm } from "@scaffold-stark-2/app/debug/_components/contract";
import { Contract, ContractName, getFunctionsByStateMutability } from "@scaffold-stark-2/utils/scaffold-stark/contract";
import { Abi } from "abi-wan-kanabi";

export const ContractWriteMethods = ({
  onChange,
  deployedContractData,
}: {
  onChange: () => void;
  deployedContractData: Contract<ContractName>;
}) => {
  if (!deployedContractData) {
    return null;
  }

  const functionsToDisplay = getFunctionsByStateMutability((deployedContractData.abi || []) as Abi, "external").map(
    fn => {
      return {
        fn,
      };
    },
  );

  if (!functionsToDisplay.length) {
    return <>No write methods</>;
  }

  return (
    <>
      {functionsToDisplay.map(({ fn }, idx) => (
        <WriteOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          key={`${fn.name}-${idx}}`}
          abiFunction={fn}
          onChange={onChange}
          contractAddress={deployedContractData.address}
          //   inheritedFrom={inheritedFrom}
        />
      ))}
    </>
  );
};
