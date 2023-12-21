import classNames from "classnames";
import React, { HTMLAttributes } from "react";

export const Logo = React.memo((p: HTMLAttributes<HTMLSpanElement>) => {
  const { className, ...props } = p;
  return (
    <span
      {...props}
      className={classNames(className, " font-SquadaOne text-[2.5rem]")}
    >
      Crust Cloud
    </span>
  );
});
