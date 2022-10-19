import React, {ButtonHTMLAttributes} from "react";

export interface IProps {
    value: number;
}
function ProgressBar_(props: IProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    const { value } = props;
    return (
        <div className="flex w-full items-center text-black">
            <div className="h-5 w-full bg-slate-300 rounded-md">
                <div className={'h-5 bg-slate-800 rounded-md'} style={{width: value+'%'}}>
                </div>
            </div>
            <span className="ml-5">{value}%</span>
        </div>

    );
}
export const ProgressBar = React.memo(ProgressBar_);
