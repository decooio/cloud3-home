import classNames from "classnames";
import React, { HTMLAttributes } from "react";
import { RiLoader2Fill } from "react-icons/ri";
export const Loading = React.memo((p: HTMLAttributes<HTMLOrSVGElement>) => {
  return (
    <RiLoader2Fill
      {...p}
      className={classNames(p.className, "animate-spin text-5xl")}
    />
  );
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
      <div
        {...other}
        className={classNames(other.className, " flex flex-col items-center")}
      >
        <Loading {...loading_attr} />
        {!!text && (
          <div
            {...text_attr}
            className={classNames(" text-2xl mt-9", text_attr.className)}
          >
            {text}
          </div>
        )}
      </div>
    );
  }
);
