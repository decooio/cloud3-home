import classNames from "classnames";
import React, { HTMLAttributes } from "react";
import { RiLoader2Fill } from "react-icons/ri";
export const Loading = React.memo((p: HTMLAttributes<HTMLOrSVGElement>) => {
  return (
    <RiLoader2Fill {...p} className={classNames("animate-spin text-5xl")} />
  );
});
