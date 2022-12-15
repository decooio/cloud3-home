import React, { HTMLAttributes } from "react";
import classnames from "classnames";
import {AiOutlineCloseCircle} from "react-icons/ai";
import {Icon} from "@components/common/Icon";

export const CommonModalClose = React.memo(
  (
    p: {
      onClose: any;
    } & HTMLAttributes<HTMLDivElement>
  ) => {
    const { onClose,className } = p;
    return (
      <Icon className={classnames("absolute right-6 top-6 text-3xl font-bold cursor-pointer",className)} onClick={onClose} icon={AiOutlineCloseCircle} />
    );
  }
);