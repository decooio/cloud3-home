import classnames from "classnames";
import React, { ButtonHTMLAttributes } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import {Icon} from "@components/common/Icon";

export interface IProps {
    text: string;
    status?: string;
}
function Alert_(props: IProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    const { text, status, className } = props;
    return (
        <div className={classnames('flex items-center text-sm text-black border-1 h-14 w-full px-5',
            status === 'success'?'border-green-600 bg-green-100':'border-rose-600 bg-rose-100')}>
            <Icon
                icon={AiFillCheckCircle}
                className={classnames('text-sm mr-3',status === 'success'?'text-green-600':'text-rose-600')}
            />
            <span>{text}</span>
        </div>
    );
}
export const Alert = React.memo(Alert_);
