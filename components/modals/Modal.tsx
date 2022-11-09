import classNames from "classnames";
import React, { HTMLAttributes, MouseEventHandler } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../common/Icon";

export const ModalHead = React.memo(
  (
    p: { title: string; onClose: () => void } & HTMLAttributes<HTMLDivElement>
  ) => {
    const { onClose, title, className, ...other } = p;
    return (
      <div
        {...other}
        className={classNames(
          " flex pb-5 justify-between border-b border-solid border-b-gray-16",
          className
        )}
      >
        <div className="text-black-3 text-lg">{title}</div>
        <div className="text-gray-12">
          <Icon
            icon={"cru-fo-x"}
            className=" text-xl cursor-pointer"
            onClick={onClose}
          />
        </div>
      </div>
    );
  }
);

export interface ModalProps {
  outClick?: MouseEventHandler<HTMLDivElement>,
  outClassname?: string
}
export const Modal = React.memo((p: ModalProps & HTMLAttributes<HTMLDivElement>) => {
  const { outClick, outClassname, className, children, ...other } = p;
  const appRoot = document?.getElementById("app-root") as any;
  if (!appRoot) return null;
  return createPortal(
    <div
      onClick={outClick}
      className={classNames(
        outClassname,
        "fixed left-0 top-0 w-screen h-screen z-40 bg-opacity-50 bg-black flex justify-center items-center"
      )}
    >
      <div
        {...other}
        className={classNames(
          className,
          " min-w-[27.5rem] p-5 bg-white text-black-1"
        )}
      >
        {children}
      </div>
    </div>,
    appRoot
  );
});
