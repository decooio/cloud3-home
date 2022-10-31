import { BucketDTO } from "@lib/http";
import { GatewayList } from "./../config";

import axios from "axios";
import { BigNumber } from "ethers";
import { useAsync } from "react-use";
import { useAccount, useNetwork } from "wagmi";
import { useW3BucketAbi } from "./useW3BucketAbi";
import { W3BucketMetadata } from "@lib/type";
import { sum, sumBy } from "lodash";

export async function getFileHistory(ipns: string) {
  try {
    const cid = (
      await axios.get<{ Path: string }>(
        `${GatewayList[0].value}/api/v0/name/resolve?arg=${ipns}`
      )
    ).data;
    const fileList = (
      await axios.get<any[]>(`https://gw-seattle.cloud3.cc${cid.Path}`)
    ).data;
    return fileList;
  } catch (error) {
    return [];
  }
}

export function useBuckets() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const w3b = useW3BucketAbi();
  return useAsync(async () => {
    if (!w3b || !address || !chain || chain.unsupported) return [];
    try {
      const count = (await w3b.balanceOf(address)).toNumber();
      const items: BucketDTO[] = [];
      for (let index = 0; index < count; index++) {
        const tokenId = await w3b.tokenOfOwnerByIndex(
          address,
          BigNumber.from(index)
        );
        const tokenUri = await w3b.tokenURI(tokenId);
        const metadata = (
          await axios.get<W3BucketMetadata>(
            tokenUri.replace("ipfs://", `${GatewayList[0].value}/ipfs/`)
          )
        ).data;
        const ipns = metadata.file_history.replace("ipns://", "");
        const fileList = await getFileHistory(ipns);

        // const fileList = (
        //     await axios.get<>(metadata.file_history.)
        // )
        const trait = metadata.attributes.find(
          (item) => item.trait_type === "CapcityInGb"
        );
        const used = sumBy(fileList, "size");
        items.push({
          ipnsId: metadata.file_history.replace("ipns://", ""),
          metadata,
          metadataCid: tokenUri.replace("ipfs://", ""),
          maxStorageSize: new Number(trait).valueOf() * 1024 * 1024 * 1024,
          usedStorageSize: used,
          metadataTxHash: "",
          mintTxHash: "",
          tokenId: tokenId.toString(),
          mintTimestamp: 0,
          fileCount: fileList.length,
        });
      }
      return items;
    } catch (error) {
      return [];
    }
  }, [address, chain]);
}
