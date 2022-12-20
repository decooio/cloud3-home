import React, {ButtonHTMLAttributes} from "react";

export interface IProps {
    value: number;
}
function ProgressBar_(props: IProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    const { value } = props;
    return (
        <div className="flex w-full items-center text-black">
            <div className="h-5 w-full bg-[#D8D8D8]">
                <div className={'h-5 bg-black-1'} style={{width: value+'%', transition: 'width 200ms ease-in-out'}}>
                </div>
            </div>
            <span className="text-right w-14">{value}%</span>
        </div>

    );
}
export const ProgressBar = React.memo(ProgressBar_);
