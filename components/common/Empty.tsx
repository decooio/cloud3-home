import classNames from "classnames";
import React, { HTMLAttributes } from "react";
import { IconCloud3 } from "./icons";

export const EmptyText = React.memo(
  (
    p: {
      empty_attr?: HTMLAttributes<HTMLOrSVGElement>;
      text_attr?: HTMLAttributes<HTMLDivElement>;
      text?: string;
    } & HTMLAttributes<HTMLDivElement>
  ) => {
    const { text = "Empty", empty_attr = {}, text_attr = {}, ...other } = p;
    return (
      <div
        {...other}
        className={classNames(other.className, "text-gray-7 flex flex-col items-center")}
      >
        <IconCloud3 {...empty_attr} className={classNames(" text-8xl", empty_attr?.className)}/>
        {!!text && (
          <div
            {...text_attr}
            className={classNames(" text-2xl", text_attr.className)}
          >
            {text}
          </div>
        )}
      </div>
    );
  }
);
