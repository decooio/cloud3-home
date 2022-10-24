import { abi } from "@lib/abi/w3bucket.abi";
import { W3Bucket_Adress } from "@lib/config";
import { useContract, useProvider, useSigner } from "wagmi";

export function useW3BucketAbi() {
  const provider = useProvider();
  const { data: signer } = useSigner();
  return useContract({
    address: W3Bucket_Adress,
    abi,
    signerOrProvider: signer || provider,
  });
}
