import { Web3Provider } from "@ethersproject/providers";
import { W3Bucket_Adress } from "@lib/config";
import { useConnect } from "@thirdweb-dev/react";
import { useMemo } from "react";
import { W3bucketAbi__factory } from "./../typechain/factories/W3bucketAbi__factory";
import { W3bucketAbi } from "./../typechain/W3bucketAbi";

export function useW3BucketAbi(): W3bucketAbi | undefined {
  const [{ data }] = useConnect();
  const connector = data && data.connector;
  return useMemo(() => {
    if (connector) {
      const provider = connector.getProvider(true);
      return W3bucketAbi__factory.connect(
        W3Bucket_Adress,
        new Web3Provider(provider)
      );
    }
    return undefined;
  }, [connector, ]);
}
