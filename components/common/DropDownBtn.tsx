import classnames from "classnames";
import React, {ButtonHTMLAttributes, useRef, useState} from "react";
import {Button} from "./Button";
import {Icon} from "@components/common/Icon";
import {FiSearch} from "react-icons/fi";
import {useClickAway, useToggle} from "react-use";

export interface IProps {
    text: string;
    dropData: any;
    onChange?: any;
}
function DropDownBtn_(props: IProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    const { text, dropData,onChange, className } = props;
    const [open,onToggle] = useToggle(false)
    const ref = useRef();
    useClickAway(ref, () => open && onToggle(false));
    const onItemClick = (value)=>{
        onToggle(false);
        onChange && onChange(value)
    }
    return (
        <div className="text-black relative" ref={ref}>
            <Button className="btn-173" text={text} onClick={()=>onToggle(!open)} />
            {
                open &&
                <ul className="text-black absolute w-full bg-white mt-3 border-1 border-gray-300 top-10 left-0 p-2 text-sm">
                    {
                        dropData && dropData.length>0 && dropData.map((v:any,i)=>{
                            return(
                                <li key={`dropdown${i}`} onClick={()=>onItemClick(v.value)} className="h-10 cursor-pointer leading-10 hover:bg-zinc-200 px-2 flex items-center">
                                    {
                                        v.icon &&
                                        <Icon
                                            icon={v.icon}
                                            className="text-sm mr-3"
                                        />
                                    }
                                    {v.text}
                                </li>
                            )
                        })
                    }
                </ul>
            }

        </div>
    );
}
export const DropDownBtn = React.memo(DropDownBtn_);
