import {
  AlgorandAlgodToken,
  AlgorandAlgodUrl,
  AlgorandW3BucketAppId,
} from "@lib/config";
import algosdk, { ABIValue, Algodv2 } from "algosdk";

interface RawBucketEdition {
  id: number;
  capacityInGigabytes: bigint;
  maxMintableSupply: bigint;
  currentSupplyMinted: bigint;
  prices: RawPrice[];
}

interface RawPrice {
  currency: string;
  price: string;
}

class W3BucketClient {
  client: Algodv2;

  constructor() {
    this.client = new algosdk.Algodv2(AlgorandAlgodToken, AlgorandAlgodUrl);
  }

  async getEditionNum() {
    return this.getApplicationGlobalValue("edition_num", "string") ?? 0;
  }

  async getEditionIds(): Promise<number[]> {
    const res = await this.getApplicationBoxByName("edition_ids", "string");
    const codec = algosdk.ABIType.from("uint64[30]");
    let array = codec.decode(res.value) as ABIValue[];
    return array.map((i) => Number(i));
  }

  async getEditionById(id: number): Promise<RawBucketEdition | null> {
    const codec = algosdk.ABIType.from("uint64");
    const encodedKey = codec.encode(id);
    const res = await this.client
      .getApplicationBoxByName(AlgorandW3BucketAppId, encodedKey)
      .do();
    const bucketItemCodec = algosdk.ABIType.from(
      `(uint64,uint64,uint64,bool,uint8[${res.value.length - 25}])`
    );
    const array = bucketItemCodec.decode(res.value) as ABIValue[];
    const isActive = array[3] as boolean;
    if (!isActive) return null;
    const priceUint8Array = array[array.length - 1] as Uint8Array;
    const priceNumberArray = priceUint8Array.map((i) => Number(i));
    const pricesCodec = algosdk.ABIType.from("(uint64,uint64)[]");
    const priceArray = pricesCodec.decode(priceNumberArray) as ABIValue[];
    const prices: RawPrice[] = [];
    priceArray.map((i) => {
      prices.push({
        currency: i[0].toString(),
        price: i[1].toString(),
      });
    });
    return {
      id: id,
      maxMintableSupply: array[0] as bigint,
      capacityInGigabytes: array[1] as bigint,
      currentSupplyMinted: array[2] as bigint,
      prices: prices,
    };
  }

  private async getApplicationGlobalValue(name: string, codecType: string) {
    const appInfo = await this.client
      .getApplicationByID(AlgorandW3BucketAppId)
      .do();
    const codec = algosdk.ABIType.from(codecType);
    const encodedKey = codec.encode(name).slice(-name.length);
    const base64Key = Buffer.from(encodedKey).toString("base64");
    for (const e of appInfo.params["global-state"]) {
      if (e.key === base64Key) {
        return e.value.uint;
      }
    }
    return null;
  }

  private getApplicationBoxByName(name: string, keyCodecType: string) {
    const keyCodec = algosdk.ABIType.from(keyCodecType);
    const encodedKey = keyCodec.encode(name).slice(-name.length);
    return this.client
      .getApplicationBoxByName(AlgorandW3BucketAppId, encodedKey)
      .do();
  }
}

export default new W3BucketClient();
