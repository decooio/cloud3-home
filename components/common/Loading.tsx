import React, { HTMLAttributes } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
export const Loading = React.memo((p: HTMLAttributes<HTMLOrSVGElement>) => {
  return <RiLoader2Fill {...p} className={twMerge("animate-spin text-5xl", p.className)} />;
});

export const LoadingText = React.memo(
  (
    p: {
      loading_attr?: HTMLAttributes<HTMLOrSVGElement>;
      text_attr?: HTMLAttributes<HTMLDivElement>;
      text?: string;
    } & HTMLAttributes<HTMLDivElement>
  ) => {
    const { text = "", loading_attr = {}, text_attr = {}, ...other } = p;
    return (
      <div {...other} className={twMerge("flex flex-col items-center", other.className)}>
        <Loading {...loading_attr} />
        {!!text && (
          <div {...text_attr} className={twMerge("text-2xl text-center mt-9", text_attr.className)}>
            {text}
          </div>
        )}
      </div>
    );
  }
);
