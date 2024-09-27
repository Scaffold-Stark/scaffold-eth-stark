import { DebugContracts } from "./_components/DebugContracts";
import { getMetadata } from "@scaffold-stark-2/utils/scaffold-stark/getMetadata";
import type { NextPage } from "next";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-Stark 2 contracts in an easy way",
});

const Debug: NextPage = () => {
  return (
    <>
      <DebugContracts />
    </>
  );
};

export default Debug;
