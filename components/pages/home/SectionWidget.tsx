import React, {useState} from "react";
import {Button} from "@components/common/Button";
import WidgetSvg from 'public/images/widget.svg'
import RichTextSvg from 'public/images/rich_text.svg'
import IPFSSvg from 'public/images/ipfs_file.svg'
import {CommonTitle} from "@components/pages/home/component/CommonTitle";
import {StorageUpload} from "@components/pages/home/component/StorageUpload";
import {PublisherUpload} from "@components/pages/home/component/PublisherUpload";
import {PublisherCode} from "@components/pages/home/component/PublisherCode";
import {StorageCode} from "@components/pages/home/component/StorageCode";

export const SectionWidget = React.memo(() => {
  const [publisherVisible,setPublisherVisible] = useState(false)
  const [publisherCodeVisible,setPublisherCodeVisible] = useState(false)
  const [storageVisible,setStorageVisible] = useState(false)
  const [storageCodeVisible,setStorageCodeVisible] = useState(false)
  return(
    <div id="widget" className="w-full pb-20 pt-16 px-12 flex flex-col items-center justify-center text-black bg-[#F5F5F5]">
      <div className="w-container">
        <CommonTitle className="w-full mb-8" text="Web3 Storage Widgets" />
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
                  <Button onClick={()=>setPublisherVisible(true)} className="btn-173" text="Play Demo" />
                  <Button onClick={()=>setPublisherCodeVisible(true)} className="btn-173 ml-5" text="Show Code" />
                </div>
              </div>
            </div>
            <div className="flex mt-20">
              <IPFSSvg />
              <div className="ml-9">
                <h5 className="font-semibold text-xl mb-4">IPFS File Storage Widget</h5>
                <p className="w-[490px]">This widget helps applications/dapps to upload files of general types to IPFS and manage file storage for their users. </p>
                <div className="flex mt-5">
                  <Button onClick={()=>setStorageVisible(true)} className="btn-173" text="Play Demo" />
                  <Button onClick={()=>setStorageCodeVisible(true)} className="btn-173 ml-5" text="Show Code" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        publisherVisible &&
          <PublisherUpload onClose={()=>setPublisherVisible(false)} />
      }
      {
        publisherCodeVisible && <PublisherCode onClose={()=>setPublisherCodeVisible(false)} />
      }
      {
        storageVisible &&
          <StorageUpload onClose={()=>setStorageVisible(false)} />
      }
      {
        storageCodeVisible &&
          <StorageCode onClose={()=>setStorageCodeVisible(false)} />
      }
    </div>
  )
});
