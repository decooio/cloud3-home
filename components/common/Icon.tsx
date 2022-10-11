import classNames from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";
import { IconType } from "react-icons";

export const Icon = React.memo(
  (p: { icon: string | IconType } & HTMLAttributes<HTMLDivElement>) => {
    const { icon, ...props } = p;
    if (typeof icon === "string")
      return <span {...props} className={classNames(props.className, icon)} />;
    const Ricon = icon as unknown as FunctionComponent;
    return <Ricon {...props} />;
  }
);
