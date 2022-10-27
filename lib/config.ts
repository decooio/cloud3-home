import { IS_TEST } from "@lib/env";
import { chain } from "wagmi";
import { IS_DEV } from "./env";

export const GA_ID = IS_DEV ? "-" : "-";
export const W3Bucket_Adress: `0x${string}` = IS_DEV
  ? "0x398663842680332A1AbA3B03bd6dB47aE984994C"
  : "0x124";

export const SupportChain =
  IS_DEV || IS_TEST ? [chain.goerli] : [chain.mainnet];