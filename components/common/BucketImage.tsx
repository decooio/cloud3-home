import { useMintData } from "@lib/hooks/useMintData";
import { MintColor, MintColorType } from "@lib/type";
import { formatW3BucketCapacity } from "@lib/utils";
import React from "react";
import { BsBucket, BsBucketFill } from "react-icons/bs";
import { IconCloud3 } from "./IconCloud3";
import { QRCode } from "./QRCode";

export const MintColors: { [k in MintColorType]: MintColor } = {
  gray: ["#EEEEEE", "#FFFFFF", "#131521"],
  // dark: ["#3C3C3C", "#282828", "#FFFFFF"],
  yellow: ["#FFDC5Ei", "#E9C132i", "#131521"],
  red: ["#FF6B81", "#F4526Ai", "#131521"],
  purple: ["#B073EF", "#925DC8", "#FFFFFF"],
  green: ["#27C282", "#1EA966", "#FFFFFF"],
  blue: ["#58AEFF", "#3895EB", "#FFFFFF"],
};

export const BucketImage = React.memo(
  React.forwardRef((p: { size: number }, ref) => {
    const { size } = p;
    const [{ color, qrcode, ipns }] = useMintData();
    const [backgroundColor, iconColor, textColor] = MintColors[color];

    return (
      <div
        ref={ref as any}
        id="generate_bucket_image"
        className=" w-[22.5rem] h-[33.1875rem] relative p-6 flex flex-col justify-between"
        style={{ backgroundColor }}
      >
        <div className="flex items-center" style={{ color: textColor }}>
          <IconCloud3 bg={iconColor} style={{ fontSize: "2.8125rem" }} />
          <span className=" font-Roboto font-medium ml-[0.625rem]">
            W3BUCKET
          </span>
        </div>
        {!!ipns ? (
          <BsBucketFill
            className=" text-[18.75rem]"
            style={{ color: iconColor }}
          />
        ) : (
          <BsBucket className=" text-[18.75rem]" style={{ color: iconColor }} />
        )}
        <div className="text-end" style={{ color: textColor }}>
          { formatW3BucketCapacity(size) }
        </div>
        <QRCode
          value={ipns}
          type={qrcode}
          className=" w-[11.5rem] h-[11.5rem] absolute left-[5rem] bottom-[7.4rem]"
        />
      </div>
    );
  })
);