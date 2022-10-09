import classnames from "classnames";
import React, { ButtonHTMLAttributes } from "react";

export interface IProps {
  text: string;
}
function Button_(props: IProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { text, className, ...other } = props;
  return (
    <button
      className={classnames(
        className,
        "p-2 w-40 border-black-1 border-solid border border-b-4"
      )}
      {...other}
    >
      {text}
    </button>
  );
}
export const Button = React.memo(Button_);
