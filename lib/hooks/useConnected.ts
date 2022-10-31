import { useAccount } from "wagmi";
import { IS_DEV, IS_TEST } from "@lib/env";
import { useMemo } from "react";
import { useNetwork } from "wagmi";

export function useConnected() {
  const { chain } = useNetwork();
  const chainId = chain && chain.id;
  const { address } = useAccount();
  return useMemo(() => {
    if (IS_DEV || IS_TEST) return address && chainId === 5;
    return address && chainId === 1;
  }, [address, chainId]);
}
