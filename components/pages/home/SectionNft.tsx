import React, {useState} from "react";
import ContainerSvg from "public/images/container.svg";
import NFTSvg from "public/images/nft.svg";
import UploadSvg from "public/images/upload.svg";
import {Button} from "@components/common/Button";
import {CommonTitle} from "@components/pages/home/component/CommonTitle";
import {DragUpload} from "@components/common/DragUpload";
import {openExtUrl, scrollToAnchor} from "@lib/utils";
import {IS_LOCAL} from "@lib/env";
export const SectionNft = React.memo(() => {
    const [visibleDropUpload, setVisibleDropUpload] = useState(false);
    const openDropUpload = ()=>{
      setVisibleDropUpload(true)
      setTimeout(() => {
          scrollToAnchor('nftupload')
      }, 0);
    }
    const onCloseDragUpload = ()=>{
        setVisibleDropUpload(false)
        setTimeout(()=>{
            scrollToAnchor('nft')
        },0)
    }
    return (
        <div className="w-full py-6 px-12 flex justify-center pb-20 mt-3 text-slate-700 text-lg" id="nft">
            <div className="w-full max-w-[1112px] flex flex-col text-black">
                <CommonTitle className="mt-6 mb-8 font-medium" text="Web3 Storage Buckets & Web3 IPFS Gateways" />
                <p className="pb-20 text-2xl text-black-3">
                    Crust Cloud defines what cloud storage middlewares should look like in Web3 - every storage bucket is a NFT, and every IPFS gateway is a NFT.
                </p>
                <div className="flex justify-center">
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center">
                            <ContainerSvg />
                            <span className="text-6xl px-6">=</span>
                            <NFTSvg />
                        </div>
                        <div className="flex items-center">
                            <UploadSvg />
                            <span className="text-6xl px-6">=</span>
                            <NFTSvg />
                        </div>
                    </div>

                    <div className="ml-16">
                        <h4 className="text-[1.375rem] font-semibold text-black mb-4">Store files in W3Buckets: Decentralized, Guaranteed & Alive.</h4>
                        <p className="text-black-3">
                            All contents in the W3Buckets are immutable, decentralized stored,  guaranteed with up to permanent persistence in the open internet, and most importantly, owned & controlled by the NFT owner.
                        </p>
                        <h4 className="text-[1.375rem] font-semibold text-black mb-4 mt-20">IPFS Remote Pin</h4>
                        <p className="text-black-3">
                            Storage service are called by Standard IPFS Remote Pinning Service APIs that make your files always available (alive!) on IPFS with multiple replicas and accessible from everywhere.
                        </p>
                        <div className="flex mt-8 text-black-1">
                            <Button onClick={openDropUpload} className="btn-173" text="Play Quick Demo" />
                            <Button
                              onClick={() =>
                                IS_LOCAL ? openExtUrl("/#/buckets", '_self') : openExtUrl("/#/buckets")
                              }
                              className="btn-173 ml-5"
                              text="Launch App"
                            />
                        </div>
                    </div>
                </div>
                {
                    visibleDropUpload &&
                    <DragUpload id="nftupload" className="h-[32.937rem] mt-12" onClose={onCloseDragUpload}/>
                }
            </div>
        </div>
    )
});
