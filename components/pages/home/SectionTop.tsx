import { Button } from "@components/common/Button";
import HomeBg from "@components/homebg";
import React, {useState} from "react";
import CloseBtnSvg from '../../../public/images/close_btn.svg'
import {getClientHeight} from '@lib/utils'

export const SectionTop = React.memo(() => {
    const [dropUpload,showDropUpload] = useState(false)
    const openDropUpload = ()=>{
        showDropUpload(true)
        setTimeout(()=>{
            window.scroll(0,getClientHeight())
        },0)
    }
    return (
        <div className="w-full min-h-min">
            {/* Anim BG */}
            <div className="w-full bg-black h-screen h-full absolute left-0 top-0 z-0">
                <HomeBg />
            </div>
            {/* Content */}
            <div className="z-1 h-[100vh] relative w-full py-6 px-12 flex flex-col items-center">
                <div className="h-14 w-full flex justify-between items-center font-WorkSans">
                    <div className="font-SquadaOne text-4xl">Cloud3.cc</div>
                    <Button text="Documentations" className="border-white text-white" />
                </div>
                <div className="my-10 w-2/3 flex flex-col justify-center mt-[23vh]">
                    <div className="text-5xl leading-tight">
                        <p>Store in IPFS W3Bucket,</p>
                        <p>Decentralized, Guaranteed & Alive.</p>
                    </div>
                    <div className="flex mt-12">
                        <Button text="Quick Start" onClick={openDropUpload} className="border-white text-white" />
                        <Button
                            text="Launch App"
                            className=" ml-3 border-white text-white"
                        />
                    </div>
                </div>
            </div>
            {
                dropUpload &&
                <div className="w-full flex justify-center">
                    <div className="relative flex justify-center items-center border border-black-1 border-4 border-dashed h-[28.937rem] w-[69.5rem] mt-12">
                        <CloseBtnSvg className="absolute right-2 top-2 cursor-pointer" onClick={()=>showDropUpload(false)} />
                        <span className="text-black text-4xl">Drag and Drop Your File here</span>
                    </div>
                    <input hidden={true} type="file"/>
                </div>
            }
        </div>
    );
});
