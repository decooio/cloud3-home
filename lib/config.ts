import { IS_TEST } from "@lib/env";
import { chain } from "wagmi";
import { IS_DEV } from "./env";

export const GA_ID = IS_DEV ? "-" : "-";
export let W3Bucket_Adress: `0x${string}` = "0x";

const chainId2ContractAddress = new Map<number, `0x${string}`>([
  [chain.mainnet.id, "0x587ad7a26C5acae69D683fE923fD3f5B0700f3Ef"],
  [chain.goerli.id, "0x398663842680332A1AbA3B03bd6dB47aE984994C"],
  [chain.arbitrum.id, "0x"],
  [chain.arbitrumGoerli.id, "0x1f0C5b696da48f5E93B1c3b3220E42b11b9a9E96"],
]);

export function setW3BucketAddress(chainId: number) {
  W3Bucket_Adress = chainId2ContractAddress.get(chainId);
}

export const SupportChain =
  IS_DEV || IS_TEST ? [chain.goerli, chain.arbitrumGoerli] : [chain.mainnet, chain.arbitrum];

export const SupportId2Chain = (() => {
  const res = new Map();
  for (const chain of SupportChain) {
    res.set(chain.id, chain);
  }
  return res;
})()

export interface AuthIpfsEndpoint {
  name?: string;
  location?: string;
  value: string;
}

export const GatewayList: AuthIpfsEndpoint[] = [
  {
    location: "Seattle, US",
    name: "Thunder Gateway",
    value: "https://gw-seattle.crustcloud.io",
  },
];
// 'https://ipfs-gw.decloud.foundation'
export const DeCloudLink = "https://gw-seattle.crustcloud.io";
export const GatewayBase = "https://ipfs.io";

// for BucketGatewayBase
export const GatewayBaseBucket = "https://ipfsgw.live";
