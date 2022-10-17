import { CSSProperties } from "react";

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
  external_url: "string"; // "https://ipfs-scan.io?cid=QmVvigK7jfLyHcDjnNYr2mAReFW9FCFWf41UNB9tbK8rWw"
  file_history: "string"; // "ipns://k51qzi5uqu5dktricedv5isy1c69oc6i7q15p7lzhkgyyarkdgz350emmvwnwa"
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
