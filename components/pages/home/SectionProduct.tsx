import React, {useState} from "react";
import IPFSLogoSvg from 'public/images/ipfs_logo.svg'
import CRUSTLogoSvg from 'public/images/crust_logo.svg'
import ContainerSmallSvg from "public/images/container_small.svg";
import UploadSmallSvg from "public/images/upload_small.svg";
import WidgetSmallSvg from "public/images/widget_small.svg";
import {CommonTitle} from "@components/pages/home/component/CommonTitle";
import {scrollToAnchor} from "@lib/utils";

export const SectionProduct = React.memo(() => {
  return(
    <div className="w-full py-20 px-12 flex flex-col items-center justify-center text-black">
      <div className="w-container">
        <CommonTitle className="w-full pb-14" text="Cloud3 is a Web3 storage cloud" />
        <div className="w-full flex justify-between text-lg">
          <div className="w-[348px] h-[418px] border-2 border-black-1 mt-12">
            <div className="flex flex-col items-center border-b-2 border-black-1 py-6">
              <h5 className="text-3xl">IasS</h5>
              <span>Infrastructure-as-a-Service</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mt-6">
                <IPFSLogoSvg />
                <CRUSTLogoSvg className="ml-11" />
              </div>
              <a href="https://crust.network" target="_blank" className="text-2xl text-black mt-5 mb-2 underline">IPFS</a>
              <span>the distrbuted file system</span>
              <a href="https://ipfs.io" target="_blank" className="text-2xl mt-4 mb-2 underline text-black">Crust Network</a>
              <p className="w-[294px] text-center">the decentralized storage protocol & incentive layer of IPFS</p>
            </div>
            <div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-orange-15 text-3xl pb-3">Cloud3 Products</h4>
            <div className="flex">
              <div className="w-[348px] h-[418px] border-2 border-orange-15">
                <div className="flex flex-col items-center border-b-2 border-orange-15 py-6">
                  <h5 className="text-3xl">PaaS</h5>
                  <span>Platform-as-a-Service</span>
                </div>
                <div className="flex flex-col items-center pt-7 pb-14">
                  <div className="flex items-center text-[2.5rem]">
                    <span className="mr-2">W3</span>
                    <ContainerSmallSvg/>
                    <span className="px-3">+</span>
                    <span className="mr-2">W3</span>
                    <UploadSmallSvg/>
                  </div>
                  <h6 onClick={()=>scrollToAnchor('nft')} className="text-2xl mt-6 mb-3 underline cursor-pointer">W3Buckets</h6>
                  <span>NFT-nized IPFS storage buckets</span>
                  <h6 onClick={()=>scrollToAnchor('nft')} className="text-2xl mt-5 mb-3 underline cursor-pointer">W3Gateways</h6>
                  <span>NFT-nized IPFS Gateways</span>
                </div>
              </div>
              <div className="w-[348px] h-[418px] border-2 border-orange-15">
                <div className="flex flex-col items-center border-b-2 border-orange-15 py-6">
                  <h5 className="text-3xl">SaaS</h5>
                  <span>Software-as-a-Service</span>
                </div>
                <div className="flex flex-col items-center pt-7 pl-6">
                  <div className="flex items-center text-[2.5rem]">
                    <span className="mr-2">W3</span>
                    <WidgetSmallSvg />
                  </div>
                  <h6 onClick={()=>scrollToAnchor('widget')} className="text-2xl mt-6 mb-3 underline cursor-pointer">Web3 Storage Widgets</h6>
                  <p className="w-[298px] text-center">Rich-text Editor/Publisher Widget
                    IPFS File Storage Widget
                  </p>
                  <p className="w-[298px] text-center">
                    IPFS Storage Retrieval Widget
                    and more...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});
