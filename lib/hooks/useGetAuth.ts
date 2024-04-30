import algoWallet from "@lib/algorand/algoWallet";
import { useOn } from "@lib/hooks/tools";
import { sleep } from "@lib/utils";
import moment from "moment";
import { useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { AlgorandChainId, AlgorandW3BucketAddress, W3Bucket_Adress } from "../config";
// description:
//   Sign for W3 Bucket Access Authentication
// signingAddress:
//   0xc937c4478ec7eb68d119d6f5b7676c2d290eb263
// tokenAddress:
//   0x398663842680332a1aba3b03bd6db47ae984994c
// effectiveTimestamp:
//   1668502595
// expirationTimestamp:
//   1668506195
//
// description:
//   Sign for W3 Bucket Access Authentication
// signingAddress:
//   0xc937c4478ec7eb68d119d6f5b7676c2d290eb263
// tokenAddress:
//   0x398663842680332a1aba3b03bd6db47ae984994c
// effectiveTimestamp:
//   1668502595
// expirationTimestamp:
//   1668506195
export function useGetAuth(
  key: string = "auth",
  cache: boolean = false,
  hours: number = 0
): [(tokenId?: string) => Promise<string>, string] {
  const [auth, setAuth] = useState(localStorage.getItem(key) || "");
  const { signTypedDataAsync } = useSignTypedData();

  let { address, chain } = useAccount();
  let chainId = chain && chain.id;
  const isAlgoConnected = algoWallet.isConnected();

  const getToken = useOn(async (tokenId?: string) => {
    const old = localStorage.getItem(key) || "";
    if ((!signTypedDataAsync || !address || !chainId) && !isAlgoConnected) throw "not connect wallet";
    if (isAlgoConnected) {
      chainId = AlgorandChainId;
      address = `0x${algoWallet.account}`;
    }
    const current = moment().unix();
    if (cache && old) {
      const lastAuth = JSON.parse(window.atob(old)).data;
      if (
        lastAuth.domain.chainId == chainId &&
        lastAuth.message.signingAddress === address &&
        lastAuth.message.tokenId === tokenId &&
        (lastAuth.message.expirationTimestamp === 0 || lastAuth.message.expirationTimestamp - current > 300)
      ) {
        setAuth(old);
        return old;
      }
    }
    const expirationTimestamp = hours <= 0 ? 0 : moment().add(hours, "hours").unix();
    // hours <= 0 ? 0 : moment().add(hours, "minutes").unix();
    const typeData = {
      domain: {
        chainId: chainId,
        name: "Cloud3.cc",
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC" as `0x${string}`,
        version: "1",
      },
      message: {
        description: "Sign for W3 Bucket Access Authentication",
        signingAddress: address,
        tokenAddress: isAlgoConnected ? AlgorandW3BucketAddress : W3Bucket_Adress,
        effectiveTimestamp: current,
        expirationTimestamp,
      },
      primaryType: "W3Bucket" as "W3Bucket",
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
      (typeData.message as any).tokenId = tokenId;
      typeData.types.W3Bucket.push({ name: "tokenId", type: "string" });
    }
    await sleep(800);
    let signature = "";
    if (isAlgoConnected) {
      const unsignedBytes = Buffer.from(
        JSON.stringify({
          domain: typeData.domain,
          types: typeData.types,
          value: typeData.message,
        })
      );
      const signatureUint8Array = await algoWallet.wallet.signData(
        [{ data: unsignedBytes, message: "For authentication" }],
        algoWallet.account
      );
      signature = window.btoa(String.fromCharCode.apply(null, signatureUint8Array[0]));
    } else {
      signature = await signTypedDataAsync({
        account: address,
        domain: typeData.domain,
        types: typeData.types,
        primaryType: typeData.primaryType,
        message: typeData.message,
      });
      // const reAddress = ethers.utils.verifyTypedData(typeData.domain, typeData.types, typeData.message, signature)
    }

    const based = window.btoa(JSON.stringify({ data: typeData, signature }));
    localStorage.setItem(key, based);
    setAuth(based);
    return based;
  });
  return [getToken, auth];
}

export function useGetAuthForMint() {
  return useGetAuth("for_mint", true, 3);
}

export function useGetAuthForGet() {
  return useGetAuth("auth", true, 12);
}

export function useGetAuthForUp() {
  return useGetAuth("for_upload", false, 1);
}

export function clearAuth() {
  localStorage.removeItem("for_mint");
  localStorage.removeItem("auth");
  localStorage.removeItem("for_upload");
}
