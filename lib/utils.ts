import moment, { utc } from "moment";
import _ from "lodash";
import numbro from "numbro";
import isMobile from "ismobilejs";
import classNames, { Argument } from "classnames";

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
  let clientHeight=0;
  if(document.body.clientHeight&&document.documentElement.clientHeight) {
    clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  } else {
    clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  }
  return clientHeight;
}


export function isSame(a: string, b: string, cases: boolean = true) {
  if (cases) return a === b;
  return _.toLower(a) === _.toLower(b);
}