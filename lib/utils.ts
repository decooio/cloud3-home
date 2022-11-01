import { GatewayList, W3Bucket_Adress } from "@lib/config";
import BN from "bn.js";
import classNames, { Argument } from "classnames";
import isMobile from "ismobilejs";
import _ from "lodash";
import { utc } from "moment";
import numbro from "numbro";
import { IS_DEV, IS_LOCAL, IS_TEST } from "./env";

export const IS_MOBILE = isMobile(window.navigator).phone;

export function mClassNames(...args: Argument[]): string {
  return classNames(...args, { is_mobile: IS_MOBILE });
}

export const shortStr = (v?: string, count = 6, endCount = 4) => {
  if (!v) return "";
  if (v.length <= count + endCount) return v;
  return `${v.toString().substring(0, count)}...${v
    .toString()
    .substring(v.length - endCount)}`;
};

export const createLandLink = (land: any) => {
  const { x, y } = land;
  return `https://www.sandbox.game/en/map/?x=${x}&y=${y}`;
};

export const formatTime = (time: number, format?: string) => {
  if (format) return utc(time * 1000).format(format);
  else return utc(time * 1000).format();
};

export const fTime = (time: number) => {
  return utc(time).format();
};

export const formatDelta = (num: number, signal: boolean = false) => {
  if (!num || !_.isFinite(num)) return "-";
  if (num > 0 && signal) return "+" + _.round(num * 100, 2) + "%";
  return _.round(num * 100, 2) + "%";
};

// lodash检测是否位纯数字的不太好用，所以用正则写了一个方法
export function isNumber(num: any): boolean {
  if (num === null || num === undefined) return false;
  return /^-?[0-9]+\.?[0-9]*$/.test(num.toString());
}
export function toThousand(num: string): string {
  if (num === null || num === undefined) return "-";
  return num.toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}
export function fNum(num: any, mantissa: number = 2) {
  if (num === null || num === undefined) return "-";
  const n = _.toNumber(num);
  if (!_.isNaN(n)) {
    return numbro(n).format({
      thousandSeparated: true,
      trimMantissa: true,
      mantissa,
    });
  }
  return num;
}

export function openExtUrl(url: string, target: "_blank" | "_self" = "_blank") {
  window.open(url, target);
}

export function getClientHeight() {
  let clientHeight = 0;
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight;
  } else {
    clientHeight =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight;
  }
  return clientHeight;
}

export function isSame(a: string, b: string, cases: boolean = true) {
  if (cases) return a === b;
  return _.toLower(a) === _.toLower(b);
}

const baseBn = new BN("800000000"); // 添加基数
const base = 36;
export function parseBucketId(bucketId: string) {
  const [cp, tokenId] = bucketId.split("-");
  const capcityGb = new BN(cp, base).sub(baseBn).toString(10);
  return [capcityGb, tokenId];
}
export function genBucketId(capcityGb: number | string, tokenId: string) {
  const capBn = new BN(capcityGb).add(baseBn);
  return `${capBn.toString(base)}-${tokenId}`;
}
if (IS_LOCAL) {
  (window as any).parseBucketId = parseBucketId;
  (window as any).genBucketId = genBucketId;
}

export function sleep(t: number) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

export function etherscanBase() {
  const base =
    IS_DEV || IS_TEST ? "https://goerli.etherscan.io" : "https://etherscan.io";
  return base;
}
export function bucketEtherscanUrl(tokenId: string | number) {
  return `${etherscanBase()}/token/${W3Bucket_Adress}?a=${tokenId}`;
}

export function etherscanTx(tx: string) {
  return `${etherscanBase()}/tx/${tx}`;
}

export function etherscanAddress(address: string) {
  return `${etherscanBase()}/address/${address}`;
}

export function formatW3BucketCapacity(
  capacityInGb: number,
  decimals: number = 0
) {
  if (capacityInGb < 0.0009765625)
    return `${_.floor(capacityInGb * 1048576, decimals)} KB`;
  if (capacityInGb < 1) return `${_.floor(capacityInGb * 1024, decimals)} MB`;
  if (capacityInGb < 1024) return `${_.floor(capacityInGb, decimals)} GB`;
  if (capacityInGb < 1048576)
    return `${_.floor(capacityInGb / 1024, decimals)} TB`;
  return `${_.floor(capacityInGb / 1048576, decimals)} PB`;
}
export function formatFileSize(
    bytes: number,
) {
  if (bytes === 0) return '0 B';
  let k = 1024, // or 1024
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

export function ipfsUrl(cid: string) {
  return `https://crustwebsites.net/ipfs/${cid}`;
}
export function ipnsUrl(ipns: string) {
  return `${GatewayList[0].value}/ipns/${ipns}`;
}