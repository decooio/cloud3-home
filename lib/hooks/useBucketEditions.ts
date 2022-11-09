import { ethers } from "ethers";
import { useMemo } from "react";
import { useAsync } from "react-use";
import { erc20ABI, useNetwork, useSigner } from "wagmi";
import { getContract } from "wagmi/actions";
import { useW3BucketAbi } from "./useW3BucketAbi";

export interface Price {
  price: string;
  symbol: string;
  decimals: number;
  currency: `0x${string}`;
  fmtPrice: string;
}
export interface BucketEdition {
  id: number;
  // active: boolean,
  capacityInGb: number;
  totalSupply: number;
  minted: number;
  prices: Price[];
}

export function useBucketEditions() {
  const w3b = useW3BucketAbi();
  const { chain } = useNetwork();
  const chainId = chain && chain.id;
  const {data: signer} = useSigner();
  const result = useAsync(async () => {
    if (w3b && chainId && signer) {
      const data = await w3b.getBucketEditions(true);
      console.info("data:", data);
      const res: BucketEdition[] = [];
      for (const item of data) {
        if(item.maxMintableSupply.lte(item.currentSupplyMinted)) continue;
        const price_list = await w3b.getBucketEditionPrices(item.editionId);
        console.info("prices:", price_list);
        const prices: Price[] = [];
        for (const price of price_list) {
          let decimals = 18;
          let symbol = "ETH";
          if (price.currency !== "0x0000000000000000000000000000000000000000") {
            const erc20 = getContract({
              address: price.currency,
              abi: erc20ABI,
              signerOrProvider: signer,
            });
            decimals = (await erc20.decimals());
            symbol = (await erc20.symbol());
            
          }
          prices.push({
            currency: price.currency,
            symbol: symbol,
            decimals,
            price: price.price.toString(),
            fmtPrice: ethers.utils.formatUnits(price.price, decimals),
          });
        }
        console.info("mprices:", prices);
        if(prices.length >= 1){
          res.push({
            id: item.editionId.toNumber(),
            capacityInGb: item.capacityInGigabytes.toNumber(),
            totalSupply: item.maxMintableSupply.toNumber(),
            minted: item.currentSupplyMinted.toNumber(),
            prices,
          });
        }
      }
      console.info("editions:", res);
      return res;
    }
    return null;
  }, [w3b, chainId, signer]);

  return useMemo(() => ({ ...result, loading: result.loading }), [result]);
}