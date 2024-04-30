import { setABI } from "@lib/abi/w3bucket.abi";
import algoWallet from "@lib/algorand/algoWallet";
import { SupportId2Chain, setW3BucketAddress } from "@lib/config";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export function useConnected() {
  const { address, chain, isConnected } = useAccount();

  const chainId = chain && chain.id;
  const isAlgoConnected = algoWallet.isConnected();
  if (chainId && isConnected) {
    setW3BucketAddress(chainId);
    setABI(chainId);
  }
  return useMemo(() => {
    return (address && isConnected) || isAlgoConnected;
  }, [address, chainId, isAlgoConnected, isConnected]);
}
