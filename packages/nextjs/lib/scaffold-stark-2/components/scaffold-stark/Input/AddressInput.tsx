import { useCallback } from "react";
import Image from "next/image";
import { CommonInputProps, InputBase } from "@scaffold-stark-2/components/scaffold-stark";
import { isAddress } from "@scaffold-stark-2/utils/scaffold-stark/common";
import { Address } from "@starknet-react/chains";
import { blo } from "blo";
import { useDebounceValue } from "usehooks-ts";

/**
 * Address input with ENS name resolution
 */
export const AddressInput = ({ value, name, placeholder, onChange, disabled }: CommonInputProps<Address | string>) => {
  // TODO : Add Starkname functionality here with cached profile, check ENS on scaffold-eth
  const [_debouncedValue] = useDebounceValue(value, 500);

  const handleChange = useCallback(
    (newValue: Address) => {
      //setEnteredEnsName(undefined);
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <InputBase<Address>
      name={name}
      placeholder={placeholder}
      value={value as Address}
      onChange={handleChange}
      disabled={disabled}
      prefix={null}
      suffix={
        // eslint-disable-next-line @next/next/no-img-element
        value && <Image alt="" className="!rounded-full" src={blo(value as `0x${string}`)} width="35" height="35" />
      }
    />
  );
};
