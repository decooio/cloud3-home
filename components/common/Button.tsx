import classnames from "classnames";
import React, { ButtonHTMLAttributes } from "react";

export interface IProps {
  text: string;
  icon?: string;
  iconClassName?: string;
  disHover?: boolean;
}
function Button_(props: IProps & ButtonHTMLAttributes<HTMLButtonElement>, ref: any) {
  const {
    text,
    icon,
    className,
    iconClassName,
    disHover = false,
    ...other
  } = props;
  return (
    <button
      {...other}
      ref={ref}
      className={classnames(
        className,
        { "hover:bg-black-1 hover:text-white": !disHover && !props.disabled },
        "font-WorkSans p-2 w-40  border-black-1 border-solid border border-b-4 flex items-center justify-center disabled:cursor-not-allowed"
      )}
    >
      {icon && <img src={icon} alt="" className={classnames(iconClassName)} />}
      {text}
    </button>
  );
}
export const Button = React.memo(React.forwardRef(Button_));
