import { useAccount } from "wagmi";
import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { SupportId2Chain, setW3BucketAddress } from "@lib/config";
import { setABI } from "@lib/abi/w3bucket.abi";
import algoWallet from "@lib/algorand/algoWallet";

export function useConnected() {
  const { chain } = useNetwork();
  const chainId = chain && chain.id;
  const { address } = useAccount();
  const isAlgoConnected = algoWallet.isConnected();
  if (chainId) {
    setW3BucketAddress(chainId);
    setABI(chainId);
  }
  return useMemo(() => {
    return (address && SupportId2Chain.has(chainId)) || isAlgoConnected;
  }, [address, chainId, isAlgoConnected]);
}
