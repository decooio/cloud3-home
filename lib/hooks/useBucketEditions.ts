import { useChainId, useSDK } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useMemo } from "react";
import { useAsync } from "react-use";
import { useW3BucketAbi } from "./useW3BucketAbi";

export interface BucketEdition {
  id: number;
  // active: boolean,
  capacityInGb: number;
  totalSupply: number;
  minted: number;
  currency: string;
  currencyDecimals: number;
  price: string;
  fmtPrice: string;
}

export function useBucketEditions() {
  const w3b = useW3BucketAbi();
  const sdk = useSDK();
  const chainId = useChainId();
  const result = useAsync(async () => {
    if (w3b && chainId) {
      const data = await w3b.getBucketEditions(true);
      console.info("data:", data);
      const res: BucketEdition[] = [];
      for (const item of data) {
        const [price] = await w3b.getBucketEditionPrices(item.editionId);
        let decimals = 18;
        if (price.currency !== "0x0000000000000000000000000000000000000000") {
          const erc20 = await sdk.getContract<"token">(price.currency, "token");
          const meta = await erc20.get();
          decimals = meta.decimals;
        }
        res.push({
          id: item.editionId.toNumber(),
          capacityInGb: item.capacityInGigabytes.toNumber(),
          totalSupply: item.maxMintableSupply.toNumber(),
          minted: item.currentSupplyMinted.toNumber(),
          currency: price.currency,
          currencyDecimals: decimals,
          price: price.price.toString(),
          fmtPrice: ethers.utils.formatUnits(price.price, decimals),
        });
      }
      console.info("editions:", res);
      return res;
    }
    return null;
  }, [w3b, chainId]);

  return useMemo(
    () => ({ ...result, loading: result.loading }),
    [result]
  );
}
