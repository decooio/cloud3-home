import { ethers } from "ethers";
import { useMemo, useState } from "react";
import { useAsync } from "react-use";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";

import { useW3BucketAbi } from "./useW3BucketAbi";
import algoWallet from "@lib/algorand/algoWallet";
import w3BucketAlgoClient from "@lib/algorand/w3BucketClient";
import algodClient from "@lib/algorand/algodClient";
import { erc20Abi } from "viem";

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
  const { chain } = useAccount();
  const chainId = chain && chain.id;
  const isAlgoConnected = algoWallet.isConnected();
  const pc = usePublicClient();
  const [time, setTime] = useState(new Date().getTime());
  const result = useAsync(async () => {
    if (w3b && chainId && pc) {
      const data = await w3b.getBucketEditions(true);
      console.info("data:", data);
      const res: BucketEdition[] = [];
      for (const item of data) {
        if (item.maxMintableSupply <= item.currentSupplyMinted) continue;
        const price_list = await w3b.getBucketEditionPrices(item.editionId);
        console.info("prices:", price_list);
        const prices: Price[] = [];
        for (const price of price_list) {
          let decimals = 18;
          let symbol = "ETH";
          if (price.currency !== "0x0000000000000000000000000000000000000000") {
            continue
            // [decimals, symbol] = await Promise.all([
            //   pc.readContract({
            //     address: price.currency,
            //     abi: erc20Abi,
            //     functionName: "decimals",
            //   }),
            //   pc.readContract({
            //     address: price.currency,
            //     abi: erc20Abi,
            //     functionName: "symbol",
            //   }),
            // ]);
          }
          prices.push({
            currency: price.currency,
            symbol: symbol,
            decimals,
            price: price.price.toString(),
            fmtPrice: ethers.utils.formatUnits(price.price, decimals),
          });
        }
        if (prices.length >= 1) {
          res.push({
            id: parseInt(item.editionId.toString()),
            capacityInGb: parseInt(item.capacityInGigabytes.toString()),
            totalSupply: parseInt(item.maxMintableSupply.toString()),
            minted: parseInt(item.currentSupplyMinted.toString()),
            prices,
          });
        }
      }
      res.sort((a,b) => a.capacityInGb - b.capacityInGb);
      console.info("editions:", res);
      return res;
    } else if (isAlgoConnected) {
      return getAlgoBucketEditions();
    }
    return null;
  }, [w3b, chainId, pc, isAlgoConnected, time]);

  return useMemo(() => ({ ...result, loading: result.loading, refresh: () => setTime((old) => old + 1) }), [result]);
}

export async function getAlgoBucketEditions() {
  const editionNum = await w3BucketAlgoClient.getEditionNum();
  const editionIds = await w3BucketAlgoClient.getEditionIds();
  console.info(`edition num:${editionNum},edition ids:${editionIds}`);
  const res: BucketEdition[] = [];
  for (let i = 0; i < editionNum; i++) {
    const editionId = editionIds[i];
    const edition = await w3BucketAlgoClient.getEditionById(editionId);
    if (!edition) {
      console.warn(`edition:${editionId} is inactive`);
      continue;
    }
    if (edition.maxMintableSupply <= edition.currentSupplyMinted) continue;
    const prices: Price[] = [];
    for (const { currency, price } of edition.prices) {
      let decimals = 6;
      let symbol = "ALGO";
      if (parseInt(currency) !== 0) {
        const asset = await algodClient.getAssetByID(parseInt(currency)).do();
        decimals = asset["params"]["decimals"];
        symbol = asset["params"]["unit-name"];
      }
      prices.push({
        currency: `0x${currency}`,
        symbol,
        decimals,
        price: price,
        fmtPrice: ethers.utils.formatUnits(price, decimals),
      });
    }
    if (prices.length >= 1) {
      res.push({
        id: edition.id,
        capacityInGb: Number(edition.capacityInGigabytes),
        totalSupply: Number(edition.maxMintableSupply),
        minted: Number(edition.currentSupplyMinted),
        prices,
      });
    }
  }
  res.sort((a,b) => a.capacityInGb - b.capacityInGb);
  console.info("editions:", res);
  return res;
}
