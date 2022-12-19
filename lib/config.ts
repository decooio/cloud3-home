import { IS_TEST } from "@lib/env";
import { chain } from "wagmi";
import { IS_DEV } from "./env";

export const GA_ID = IS_DEV ? "-" : "-";
export const W3Bucket_Adress: `0x${string}` =
  IS_DEV || IS_TEST
    ? "0x398663842680332A1AbA3B03bd6dB47aE984994C"
    : "0x587ad7a26C5acae69D683fE923fD3f5B0700f3Ef";

export const SupportChain =
  IS_DEV || IS_TEST ? [chain.goerli] : [chain.mainnet];

export interface AuthIpfsEndpoint {
  name?: string;
  location?: string;
  value: string;
}

export const GatewayList: AuthIpfsEndpoint[] = [
  {
    location: "Seattle, US",
    name: "Thunder Gateway",
    value: "https://gw-seattle.cloud3.cc",
  },
];
// 'https://ipfs-gw.decloud.foundation'
export const DeCloudLink = "https://gw.crustfiles.app";
export const GatewayBase = "https://ipfsgw.xyz";

// for BucketGatewayBase
export const GatewayBaseBucket = "https://ipfsgw.live";