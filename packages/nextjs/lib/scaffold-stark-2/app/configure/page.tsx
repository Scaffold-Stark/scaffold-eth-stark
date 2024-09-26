import DownloadContracts from "./_components/DownloadContracts";
import { getMetadata } from "@scaffold-stark-2/utils/scaffold-stark/getMetadata";
import type { NextPage } from "next";

export const metadata = getMetadata({
  title: "Configure Contracts",
  description: "Configure your deployed 🏗 Scaffold-Stark 2 contracts",
});

const Configure: NextPage = () => {
  return (
    <>
      <DownloadContracts />
    </>
  );
};

export default Configure;
