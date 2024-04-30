import { IS_TEST } from "@lib/env";
import * as chain from "wagmi/chains";
import { IS_DEV } from "./env";

export const GA_ID = IS_DEV ? "-" : "-";
export let W3Bucket_Adress: `0x${string}` = "0x";

const chainId2ContractAddress = new Map<number, `0x${string}`>([
  [chain.mainnet.id, "0x587ad7a26C5acae69D683fE923fD3f5B0700f3Ef"],
  [chain.goerli.id, "0x398663842680332A1AbA3B03bd6dB47aE984994C"],
  [chain.arbitrum.id, "0xe42719cDA4CCa7Abd2243e18604372C6B1c5790c"],
  [chain.arbitrumGoerli.id, "0x1f0C5b696da48f5E93B1c3b3220E42b11b9a9E96"],
  [chain.base.id, "0x7aE8066d7e630f08a7dd60C6f067d93Ef5EA8a39"],
  [chain.optimism.id, "0x7aE8066d7e630f08a7dd60C6f067d93Ef5EA8a39"],
]);

export function setW3BucketAddress(chainId: number) {
  W3Bucket_Adress = chainId2ContractAddress.get(chainId);
}

export const SupportChain = [chain.goerli, chain.arbitrumGoerli, chain.mainnet, chain.arbitrum, chain.base, chain.optimism].filter(
  (chain) => (IS_DEV || IS_TEST ? true : !chain.testnet)
);

export const SupportId2Chain = (() => {
  const res = new Map();
  for (const chain of SupportChain) {
    res.set(chain.id, chain);
  }
  return res;
})();

export const AlgorandAlgodToken = "a".repeat(64);
// For testnet
// export const AlgorandChainId = 416002;
// export const AlgorandW3BucketAppId = 535674828;
// export const AlgorandW3BucketAddress = "MP3MQ6LKG3AXVSKDDFXICZLWHOXL7OUTUBFXHU5BOM4NIK4LFQNV5QEAVM";
// export const AlgorandAlgodUrl = "https://testnet-api.algonode.cloud";
// export const AlgorandExplorerUrl = "https://app.dappflow.org";
// For mainnet
export const AlgorandChainId = 416001;
export const AlgorandW3BucketAppId = 1606796117;
export const AlgorandW3BucketAddress = "MYP5YEAANQZFBM2RDRIGEW7QPNEJYXNEWUHEM7HXI6HYYACSWLSNRCIZM4";
export const AlgorandAlgodUrl = "https://mainnet-api.algonode.cloud";
export const AlgorandExplorerUrl = "https://app.dappflow.org";

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
export const DeCloudLink = "https://gw.crustfiles.app";
export const GatewayBase = "https://cf-ipfs.com";

// for BucketGatewayBase
export const GatewayBaseBucket = "https://ipfsgw.live";


export const ChainIcon = {
  [chain.mainnet.id]: "/images/chain/ethereum.png",
  [chain.arbitrum.id]: "/images/chain/arbitrum.png",
  [chain.base.id]: "/images/chain/base.png",
  [chain.optimism.id]: "/images/chain/optimism.png",
}