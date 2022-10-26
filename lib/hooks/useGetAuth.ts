import { useOn } from "@lib/hooks/tools";
import moment from "moment";
import { useState } from "react";
import { useSignTypedData, useAccount, useNetwork } from "wagmi";
import { W3Bucket_Adress } from "../config";

export function useGetAuth(
  key: string = "auth",
  cache: boolean = false,
): [(tokenId?: string) => Promise<string>, string] {
  const [auth, setAuth] = useState(sessionStorage.getItem(key) || "");

  const { signTypedDataAsync } = useSignTypedData();
  const { chain } = useNetwork();
  const chainId = chain && chain.id;
  const { address } = useAccount();

  const getToken = useOn(async (tokenId?: string) => {
    const old = sessionStorage.getItem(key) || "";
    if (!signTypedDataAsync || !address || !chainId) throw "not connect wallet";
    if (cache && old) {
      const lastAuth = JSON.parse(window.atob(old));
      const current = moment().unix();
      if (
        lastAuth.domain.chainId === `${chainId}` &&
        lastAuth.message.signingAddress === address &&
        lastAuth.message.tokenId === tokenId &&
        lastAuth.message.expirationTimestamp - current > 300
      ) {
        setAuth(old);
        return old;
      }
    }
    const typeData: any = {
      domain: {
        chainId: `${chainId}`,
        name: "Cloud3.cc",
        verifyingContract:
          "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC" as `0x${string}`,
        version: "1",
      },
      message: {
        description: "Sign for W3 Bucket Access Authentication",
        signingAddress: address,
        tokenAddress: W3Bucket_Adress,
        effectiveTimestamp: moment().unix(),
        expirationTimestamp: moment().add(3, "hours").unix(),
      },
      primaryType: "W3Bucket",
      types: {
        W3Bucket: [
          { name: "description", type: "string" },
          { name: "signingAddress", type: "address" },
          { name: "tokenAddress", type: "address" },
          { name: "effectiveTimestamp", type: "uint256" },
          { name: "expirationTimestamp", type: "uint256" },
        ],
      },
    };
    if (tokenId) {
      typeData.message.tokenId = tokenId;
      typeData.types.W3Bucket.push({ name: "tokenId", type: "string" });
    }
    const signature = await signTypedDataAsync({
      domain: typeData.domain,
      types: typeData.types,
      value: typeData.message,
    });
    const based = window.btoa(JSON.stringify({ data: typeData, signature }));
    sessionStorage.setItem(key, based);
    setAuth(based);
    return based;
  });
  return [getToken, auth];
}
