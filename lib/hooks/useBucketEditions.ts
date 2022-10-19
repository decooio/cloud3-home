import { ERC20Abi__factory } from "./../typechain/factories/ERC20Abi__factory";
import { useChainId, useSDK } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useMemo } from "react";
import { useAsync } from "react-use";
import { useW3BucketAbi } from "./useW3BucketAbi";
import { useWeb3Provider } from "./useWeb3Provider";

export interface Price {
  price: string;
  symbol: string;
  decimals: number;
  currency: string;
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
  const sdk = useSDK();
  const chainId = useChainId();
  const provider = useWeb3Provider();
  const result = useAsync(async () => {
    if (w3b && chainId && sdk && provider) {
      const data = await w3b.getBucketEditions(true);
      console.info("data:", data);
      const res: BucketEdition[] = [];
      for (const item of data) {
        const price_list = await w3b.getBucketEditionPrices(item.editionId);
        console.info("prices:", price_list);
        const prices: Price[] = [];
        for (const price of price_list) {
          let decimals = 18;
          let symbol = "ETH";
          if (price.currency !== "0x0000000000000000000000000000000000000000") {
            const erc20 = ERC20Abi__factory.connect(price.currency, provider);
            decimals = (await erc20.decimals()).toNumber();
            symbol = (await erc20.symbol()).toString();
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
        res.push({
          id: item.editionId.toNumber(),
          capacityInGb: item.capacityInGigabytes.toNumber(),
          totalSupply: item.maxMintableSupply.toNumber(),
          minted: item.currentSupplyMinted.toNumber(),
          prices,
        });
      }
      console.info("editions:", res);
      return res;
    }
    return null;
  }, [w3b, chainId, sdk, provider]);

  return useMemo(() => ({ ...result, loading: result.loading }), [result]);
}
