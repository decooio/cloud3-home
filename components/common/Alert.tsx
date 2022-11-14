import classnames from "classnames";
import React, { ButtonHTMLAttributes } from "react";
import { AiFillCheckCircle,AiFillCloseCircle } from "react-icons/ai";
import {Icon} from "@components/common/Icon";

export interface IProps {
    text: string;
    status?: string;
}
function Alert_(props: IProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    const { text, status, className } = props;
    return (
        <div className={classnames('flex items-center text-sm text-black border-1 h-14 w-full px-5',
            status === 'success'?'border-[#32CB9D] bg-green-50':'border-[#EF4C56] bg-rose-50')}>
            <Icon
                icon={status === 'success'?AiFillCheckCircle:AiFillCloseCircle}
                className={classnames('text-xl mr-3',status === 'success'?'text-[#32CB9D]':'text-[#EF4C56]')}
            />
            <span>{text}</span>
        </div>
    );
}
export const Alert = React.memo(Alert_);
