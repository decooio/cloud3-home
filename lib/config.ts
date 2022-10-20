import { IS_DEV } from "./env";

export const GA_ID = IS_DEV ? "-" : "-";
export const W3Bucket_Adress = IS_DEV
  ? "0x398663842680332A1AbA3B03bd6dB47aE984994C"
  : "";

