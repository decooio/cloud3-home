import React, {useEffect, useState} from "react";
import {MonitorMap} from "@components/common/MonitorMap";
import UniswapSvg from '../../../public/images/uniswp.svg'
import ArrowSvg from '../../../public/images/arrow.svg'
import {randomNum} from "@lib/utils";
export const SectionMid = React.memo(() => {
    const [activePos,setActivePos] = useState([])
    const [realActiveNum,setRealActiveNum] = useState(0)
    useEffect(()=>{
        onMonitorMapChange()
    },[])
    const onMonitorMapChange = ()=>{
        let arr = []
        for(let i = 0; i<=230; i++){
            arr.push(
                {x:Math.ceil(Math.random()*120),y:randomNum(0,30)},
            )
        }
        for(let i = 0; i<=80; i++){
            arr.push(
              {x:Math.ceil(Math.random()*120),y:randomNum(31,60)},
            )
        }
        setActivePos(arr)
    }
    return(
        <div className="w-full py-6 px-12 flex flex-col items-center">
            <div className="my-10 flex justify-center mt-20">
                <MonitorMap activePos={activePos} onChange={(arr)=>{setRealActiveNum(arr.length)}} className="mt-10" />
                <div className="flex flex-col items-center w-96 ml-10">
                    <div className="w-full flex justify-between items-center">
                        <ArrowSvg className="cursor-pointer" onClick={onMonitorMapChange} />
                        <UniswapSvg className="mt-[-20px]" />
                        <ArrowSvg className="rotate-180 cursor-pointer" onClick={onMonitorMapChange} />
                    </div>
                    <span className="text-black text-lg mt-12 font-medium">
                      Check this real-time monitor to see how we help Uniswap decentralized host their Dapp frontend:
                  </span>
                    <div className="text-slate-700 text-lg mt-3">
                        <p className="mt-5">
                            <span className="text-orange-500 text-lg text-2xl">{realActiveNum}</span> IPFS Replicas all around the globe
                        </p>
                        <p className="mt-5">
                            <span className="text-orange-500 text-lg text-2xl">99+</span> Years guaranteed with <span className="text-orange-500 text-lg text-2xl">1.5ETH</span> in payment contract
                        </p>
                        <p className="mt-5">
                            Guranteed by decentralized incentive protocol on IPFS
                        </p>
                        <p className="mt-5">
                            Verifiable on IPFS Scan
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
});
