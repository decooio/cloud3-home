import React, { HTMLAttributes } from "react";
import classnames from "classnames";

export const CommonTitle = React.memo(
  (
    p: {
      text?: string;
    } & HTMLAttributes<HTMLDivElement>
  ) => {
    const { text = "",className } = p;
    return (
      <div className={classnames("text-left font-medium text-[2.5rem]",className)}>
        {text}
      </div>
    );
  }
);
