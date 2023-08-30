import arbitrumABI from './w3bucket.arbitrum.abi.json';
import ethABI from './w3bucket.abi.json';
import { chain } from "wagmi";

export function setABI(chainId: number) {
  if (chainId === chain.arbitrumGoerli.id || chainId === chain.arbitrum.id) {
    abi = arbitrumABI;
  }
  abi = ethABI;
}

export let abi = []