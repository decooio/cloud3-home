import { W3Bucket_Adress } from "@lib/config";
import { useMemo } from "react";
import { W3bucketAbi__factory } from "./../typechain/factories/W3bucketAbi__factory";
import { W3bucketAbi } from "./../typechain/W3bucketAbi";
import { useWeb3Provider } from "./useWeb3Provider";

export function useW3BucketAbi(): W3bucketAbi | undefined {
  const provider = useWeb3Provider()
  return useMemo(() => {
    if (provider) {
      return W3bucketAbi__factory.connect(
        W3Bucket_Adress,
        provider
      );
    }
    return undefined;
  }, [provider]);
}
