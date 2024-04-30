import { abi } from "@lib/abi/w3bucket.abi";
import { W3Bucket_Adress } from "@lib/config";
import { useMemo } from "react";
import { Address, PublicClient, WaitForTransactionReceiptReturnType, fromBytes, stringToHex } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";

function createRead<ARGS extends any[], T>(pc: PublicClient, fnName: string): (...args: ARGS) => Promise<T> {
  return async (...args: ARGS) => {
    const res = await pc.readContract({
      address: W3Bucket_Adress,
      abi,
      functionName: fnName,
      args: args as any,
    });
    return res as unknown as T;
  };
}

function createWrite<ARGS extends any[]>(
  pc: PublicClient,
  write: (config: any) => Promise<Address>,
  fnName: string
): (args: ARGS, value?: bigint) => Promise<WaitForTransactionReceiptReturnType> {
  return async (args: ARGS, value?: bigint) => {
    const hash = await write({
      abi,
      address: W3Bucket_Adress,
      functionName: fnName,
      args: args,
      value: value ?? 0n,
    });
    return await pc.waitForTransactionReceipt({ hash, confirmations: 3 });
  };
}

export function useW3BucketAbi() {
  const pc = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  return useMemo(() => {
    return {
      EDITIONS_ADMIN_ROLE: "0x2df17a824d09183391ae9fad0fd9d20569643282d3f018221bc2ace11f4b4b3e" as Address,
      balanceOf: createRead<[owner: Address], bigint>(pc, "balanceOf"),
      tokenOfOwnerByIndex: createRead<[owner: Address, index: bigint], bigint>(pc, "tokenOfOwnerByIndex"),
      tokenURI: createRead<[tokenId: bigint], string>(pc, "tokenURI"),
      getBucketEditions: createRead<
        [activeOnly: boolean],
        { editionId: bigint; active: boolean; capacityInGigabytes: bigint; maxMintableSupply: bigint; currentSupplyMinted: bigint }[]
      >(pc, "getBucketEditions"),
      getBucketEditionPrices: createRead<[editionId: bigint], { currency: Address; price: bigint }[]>(pc, "getBucketEditionPrices"),
      hasRole: createRead<[role: Address, user: Address], boolean>(pc, "hasRole"),

      mint: createWrite<[to: Address, editionId: bigint, currency: Address, uri: string]>(pc, writeContractAsync, "mint"),

      // admin
      setBucketEditions: createWrite<
        [
          editions: {
            editionId: bigint;
            capacityInGigabytes: bigint;
            maxMintableSupply: bigint;
          }[]
        ]
      >(pc, writeContractAsync, "setBucketEditions"),
      setBucketEditionPrices: createWrite<[editionId: bigint, prices: { currency: Address; price: bigint }[]]>(
        pc,
        writeContractAsync,
        "setBucketEditionPrices"
      ),
    };
  }, [pc, pc.chain?.id, writeContractAsync]);
}
