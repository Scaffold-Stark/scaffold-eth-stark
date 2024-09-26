import scaffoldConfig from "@scaffold-stark-2/scaffold.config";
import * as chains from "@starknet-react/chains";
import { useStarkProfile } from "@starknet-react/core";

const useConditionalStarkProfile = (address: chains.Address | undefined) => {
  const shouldUseProfile = scaffoldConfig.targetNetworks[0].id !== chains.devnet.id;
  // Conditional hooks are not recommended, but in this case, it's the best approach to avoid issues on devnet.
  const profile = shouldUseProfile
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useStarkProfile({ address })
    : { data: undefined };
  return profile;
};

export default useConditionalStarkProfile;
