import TransactionComp from "../_components/TransactionComp";
import { isZeroAddress } from "@scaffold-eth-2/utils/scaffold-eth/common";
import type { NextPage } from "next";
import { Hash } from "viem";

type PageProps = {
  params: { txHash?: Hash };
};

export function generateStaticParams() {
  // An workaround to enable static exports in Next.js, generating single dummy page.
  return [{ txHash: "0x0000000000000000000000000000000000000000" }];
}
const TransactionPage: NextPage<PageProps> = ({ params }: PageProps) => {
  const txHash = params?.txHash as Hash;

  if (isZeroAddress(txHash)) return null;

  return <TransactionComp txHash={txHash} />;
};

export default TransactionPage;
