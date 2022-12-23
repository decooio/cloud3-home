import React, {useState} from "react";
import {MonitorMap,basePos} from "@components/common/MonitorMap";
import UniswapSvg from '../../../public/images/uniswp.svg'
import ArrowSvg from '../../../public/images/arrow.svg'
import AaveSvg from '../../../public/images/aave_logo.svg'
import {randomNum} from "@lib/utils";
import classnames from "classnames";
import {CommonTitle} from "@components/pages/home/component/CommonTitle";

const getRedDoc = ()=>{
    let arr = []
    // 美国
    for(let i = 0; i<=50; i++){
        arr.push(
          {x:randomNum(30,50),y:randomNum(15,26)},
        )
    }
    for(let i = 0; i<=8; i++){
        arr.push(
          {x:randomNum(18,23),y:randomNum(22,28)},
        )
    }
    // 欧洲
    for(let i = 0; i<=60; i++){
        arr.push(
          {x:randomNum(55,70),y:randomNum(0,22)},
        )
    }
    // 俄罗斯
    for(let i = 0; i<=5; i++){
        arr.push(
          {x:randomNum(80,110),y:randomNum(0,20)},
        )
    }
    // 亚洲
    for(let i = 0; i<=25; i++){
        arr.push(
          {x:randomNum(102,110),y:randomNum(22,30)},
        )
    }
    // 中东
    for(let i = 0; i<=5; i++){
        arr.push(
          {x:randomNum(85,90),y:randomNum(26,35)},
        )
    }
    // 澳洲
    for(let i = 0; i<=5; i++){
        arr.push(
          {x:randomNum(114,116),y:randomNum(50,60)},
        )
    }
    // 非洲
    for(let i = 0; i<=5; i++){
        arr.push(
          {x:randomNum(30,50),y:randomNum(30,62)},
        )
    }
    for(let i = 0; i<=5; i++){
        arr.push(
          {x:randomNum(60,75),y:randomNum(30,62)},
        )
    }
    const real = []
    arr.map(v=>{
        for(let i = 0; i<basePos.length; i++){
            let yGroup = basePos[i]
            let isStop = false
            for(let j=0; j<yGroup.length; j++){
                let item = yGroup[j]
                if(v.x>=item[0] && v.x<=item[1] && v.y === i){
                    real.push(item)
                    isStop = true
                    break
                }
            }
            if(isStop) break
        }
    })
    return {
        activePos: arr,
        total: real.length
    }
}

const uniswap = ()=>{
    const redDoc = getRedDoc()
    return {
        logo: <UniswapSvg className="mt-[-30px]"/>,
        name: 'Uniswap',
        activePos: redDoc.activePos,
        total: redDoc.total
    }
}
const aave = ()=>{
    const redDoc = getRedDoc()
    return {
        logo: <AaveSvg className="" />,
        name: 'AAVE',
        activePos: redDoc.activePos,
        total: redDoc.total
    }
}
const monitorProject = [
    uniswap(),
    aave(),
]
export const SectionCases = React.memo(() => {
    const [selectedMonitorProjectIndex,setSelectedMonitorProjectIndex] = useState(0)
    const onMonitorMapChangePrev = ()=>{
        setSelectedMonitorProjectIndex((selectedMonitorProjectIndex-1>=0)?selectedMonitorProjectIndex-1:monitorProject.length-1)
    }
    const onMonitorMapNext = ()=>{
        setSelectedMonitorProjectIndex((selectedMonitorProjectIndex+1>monitorProject.length-1)?0:selectedMonitorProjectIndex+1)
    }
    return(
        <div className="w-full pt-6 pb-[min(12vmin,18.75rem)] px-12 flex flex-col items-center">
            <div className="my-10 text-black w-full max-w-[1310px]">
                <CommonTitle className="mx-auto max-w-[1120px] " text="Discover some real use cases" />
                {
                    monitorProject.map((v,i)=>{
                        return(
                          i === selectedMonitorProjectIndex &&
                          <div key={`monitorProject${i}`} className={classnames("flex justify-center pt-5")}>
                              <MonitorMap activePos={v.activePos} className="flex-1 pt-16" />
                              <div className="flex flex-shrink-0 flex-col items-center w-[22.625rem] ml-10 ">
                                  <div className="h-[4.625rem] w-full flex justify-between items-center">
                                      <ArrowSvg className="cursor-pointer" onClick={onMonitorMapChangePrev} />
                                      {v.logo}
                                      <ArrowSvg className="rotate-180 cursor-pointer" onClick={onMonitorMapNext} />
                                  </div>
                                  <span className="text-black text-lg mt-12 font-medium">
                      Check this real-time monitor to see how we help {v.name} decentralized host their Dapp frontend:
                    </span>
                                  <div className="text-black-3 text-lg mt-3">
                                      <p className="mt-5">
                                          <span className="text-orange-500 font-medium text-2xl">{v.total}</span> IPFS Replicas all around the globe
                                      </p>
                                      <p className="mt-5">
                                          <span className="text-orange-500 font-medium text-2xl">99+</span> Years guaranteed with <span className="text-orange-500 font-medium text-2xl">1.5ETH</span> in payment contract
                                      </p>
                                      <p className="mt-5">
                                          Guranteed by <a className="text-black-3 underline" href="https://crust.network/" target="_blank">decentralized incentive protocol</a> on IPFS
                                      </p>
                                      <p className="mt-5">
                                          Verifiable on <a className="text-black-3 underline" href="https://ipfs-scan.io/" target="_blank">IPFS Scan</a>
                                      </p>
                                  </div>
                              </div>
                          </div>
                        )
                    })
                }
            </div>
        </div>
    )
});
