import React, {useState} from "react";
import {Button} from "@components/common/Button";
import WidgetSvg from 'public/images/widget.svg'
import RichTextSvg from 'public/images/rich_text.svg'
import IPFSSvg from 'public/images/ipfs_file.svg'
import {CommonTitle} from "@components/pages/home/CommonTitle";

export const SectionWidget = React.memo(() => {
  return(
    <div className="w-full pb-20 pt-16 px-12 flex flex-col items-center justify-center text-black bg-[#F5F5F5]">
      <div className="w-container">
        <CommonTitle className="w-full pb-14" text="Web3 Storage Widgets" />
        <p className="w-full text-left text-2xl mb-20">
          Users should own their contents and take full control of them just like what they do to their assets, but they do not.
        </p>
        <div className="flex justify-between">
          <div className="w-[405px] flex flex-col items-center">
            <WidgetSvg />
            <p className="mt-14">
              Web3 Content Widgets contains several easy-integrating, non-intrusive widges that helps Dapps to manage decentralized IPFS storage and give back content ownership to users.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex">
              <RichTextSvg />
              <div className="ml-9">
                <h5 className="font-semibold text-xl mb-4">Rich-text Content Publisher Widget</h5>
                <p className="w-[490px]">This widget contains a rich-text editor that can auto upload contents to IPFS alongside the publish process. </p>
                <div className="flex mt-5">
                  <Button text="Play Demo" />
                  <Button className="ml-5" text="Show Code" />
                </div>
              </div>
            </div>
            <div className="flex mt-20">
              <IPFSSvg />
              <div className="ml-9">
                <h5 className="font-semibold text-xl mb-4">IPFS File Storage Widget</h5>
                <p className="w-[490px]">This widget helps applications/dapps to upload files of general types to IPFS and manage file storage for their users. </p>
                <div className="flex mt-5">
                  <Button text="Play Demo" />
                  <Button className="ml-5" text="Show Code" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});
