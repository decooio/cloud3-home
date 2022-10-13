import classNames from "classnames";
import React, { HTMLAttributes, useMemo, useRef } from "react";
import { useClickAway, useToggle } from "react-use";

export interface SelectItem {
  text: string;
}

export interface SelectProps {
  options: SelectItem[];
  current: SelectItem;
  perfix?: string;
  onOptionChange?: (n: SelectItem) => void;
}

export const Select = React.memo(
  (p: SelectProps & HTMLAttributes<HTMLDivElement>) => {
    const { options, current, perfix, className, onOptionChange, ...props } = p;
    const text = useMemo(() => {
      if (perfix) return `${perfix} ${current.text}`;
      return current.text;
    }, [current, perfix]);
    const ref = useRef();
    const [open, onToggle] = useToggle(false);
    useClickAway(ref, () => open && onToggle(false));
    return (
      <div
        {...props}
        ref={ref}
        className={classNames(className, " relative text-gray-7")}
      >
        <div className=" whitespace-nowrap cursor-pointer flex items-center" onClick={onToggle}>
          {text} <span className="cru-fo-chevron-down ml-3" />
        </div>
        {open && (
          <div className=" absolute top-full right-0 border-solid border-black-1 border bg-white z-10">
            {options.map((op, index) => (
              <div
                key={`options_${index}`}
                className={classNames(
                  " py-2 px-4 whitespace-nowrap cursor-pointer",
                  {
                    "bg-black-1 text-white": op === current,
                  }
                )}
                onClick={() => {
                  onOptionChange && onOptionChange(op);
                  onToggle(false);
                }}
              >
                {op.text}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
