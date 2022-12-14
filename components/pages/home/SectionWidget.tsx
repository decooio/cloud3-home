import React, {useState} from "react";
import {Button} from "@components/common/Button";
import WidgetSvg from 'public/images/widget.svg'
import RichTextSvg from 'public/images/rich_text.svg'
import IPFSSvg from 'public/images/ipfs_file.svg'
import {CommonTitle} from "@components/pages/home/CommonTitle";
import {Modal} from "@components/modals/Modal";
import {CommonModalClose} from "@components/pages/home/CommonModalClose";

export const SectionWidget = React.memo(() => {
  const [publisherState,setPublisherState] = useState(0)
  const [storageState,setStorageState] = useState(0)
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
                  <Button onClick={()=>setPublisherState(1)} text="Play Demo" />
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
                  <Button onClick={()=>setStorageState(1)} text="Play Demo" />
                  <Button className="ml-5" text="Show Code" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        publisherState != 0 &&
        <Modal className="p-0">
          <div
            className="bg-white flex min-h-[43.75rem] relative"
          >
            <CommonModalClose onClose={()=>setPublisherState(0)} />
            <div className="bg-black w-80 text-white px-8 py-16 text-lg">
              <h4 className="mb-12 text-2xl font-medium">
                Rich-text Content Publisher Widget
              </h4>
              <div>
                <h5 className="mb-5 font-medium">Demo Step 1:</h5>
                <p className="mb-5 font-light">
                  Type in any text and try to do some simple edit work.
                </p>
                <p className="font-light">
                  When you finish, click on the <span className="font-medium">'Publish'</span> button to continue.
                </p>
              </div>
            </div>
            <div className="min-w-[57.5rem]">

            </div>
          </div>
        </Modal>
      }
      {
        storageState != 0 &&
        <Modal className="p-0">
          <div
            className="bg-white flex min-h-[43.75rem] relative"
          >
            <CommonModalClose onClose={()=>setStorageState(0)} />
            <div className="bg-black w-80 text-white px-8 py-16 text-lg">
              <h4 className="mb-12 text-2xl font-medium">
                IPFS File Storage Widget
              </h4>
              <div>
                <h5 className="mb-5 font-medium">Demo Step 1:</h5>
                <p className="mb-5 font-light">
                  Drag and drop a file into the box.
                </p>
                <p className="font-light">
                  When you finish, click on the <span className="font-medium">'Upload'</span> button to continue.
                </p>
              </div>
            </div>
            <div className="min-w-[57.5rem]">

            </div>
          </div>
        </Modal>
      }
    </div>
  )
});
