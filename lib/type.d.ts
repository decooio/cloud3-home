import { CSSProperties } from "react";
import { Price } from "./hooks/useBucketEditions";

export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  disableTheme?: boolean;
}

export interface BasePropsWithChildren extends BaseProps {
  children: any;
}

export interface Trait<T> {
  trait_type: string;
  value: T;
}

export type TraitType = Trait<string>;
export interface DStorage {
  platform: string; //  "Crust"
  description: string; //  "Crust Network, the Incentive Layer of IPFS"
  persistence_mechanism: string; // "contract-based"
  challenge_mechanism: string; // "mpow"
  consensus: string; // "gpos"
  dstorage_note: string; // "0x466ab180124de1718d30cd2e018e7fe013a07c4860674110ccd13e97eb31ae16"
}
export interface W3BucketMetadata {
  name: string; // "<Encoded Bucket ID>"
  description: string; // "<To Be Provided>"
  image: string; // "ipfs://QmVvigK7jfLyHcDjnNYr2mAReFW9FCFWf41UNB9tbK8rWw"
  external_url: string; // "https://ipfs-scan.io?cid=QmVvigK7jfLyHcDjnNYr2mAReFW9FCFWf41UNB9tbK8rWw"
  file_history: string; // "ipns://k51qzi5uqu5dktricedv5isy1c69oc6i7q15p7lzhkgyyarkdgz350emmvwnwa"
  attributes: TraitType[] /*
  [
    {
      trait_type: "dStorage Platform";
      value: "Crust";
    },
    {
      trait_type: "Edition";
      value: "1";
    },
    {
      trait_type: "Capacity (GB)";
      value: "1024";
    }
  ]
  */;
  dStorage: DStorage;
}

export type MintColor = [string, string, string];
export type MintColorType =
  | "gray"
  | "yellow"
  | "red"
  | "purple"
  | "green"
  | "blue";

export type QRCODE_STYLE =
  | "A1"
  | "A-a1"
  | "A-a2"
  | "A-b1"
  | "A-b2"
  | "A2"
  | "A3"
  | "C1"
  | "C2"
  | "C3"
  | "SP-1"
  | "SP-2"
  | "SP-3";


export interface CrustOrder {
  tx: string,
  cid: string,
}  
export interface MintData {
  color: MintColorType;
  qrcode: QRCODE_STYLE;
  editionId?: number;
  price?: Price;
  ipns?: string;
  uuid?: string;
  metadata?: W3BucketMetadata;
  metadataCID?: string;
  metadataTX?: string;

  mintTx?: string;
  tokenId?: string;
  bucketId?: string;
}

export interface FileItem {
  Hash: string,
  Size: string,  // bytes
  Name: string,  
  Dir?: boolean, // 是否是文件夹
}