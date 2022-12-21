import {Modal} from "@components/modals/Modal";
import {CommonModalClose} from "@components/pages/home/component/CommonModalClose";
import {Icon} from "@components/common/Icon";
import {AiOutlineCheckCircle} from "react-icons/ai";
import {DragUpload} from "@components/common/DragUpload";
import React, {useState} from "react";
import {ProgressBar} from "@components/common/ProgressBar";
import { shortStr } from "@lib/utils";

interface IProps {
  onClose: any
}
export function StorageUpload(p: IProps){
  const {onClose} = p
  const [storageState,setStorageState] = useState(0)
  const [storageData,setStorageData] = useState({Hash:''})
  const onStorageUploadSuccess = (res:{Hash: string})=>{
    setStorageState(3)
    setStorageData(res)
  }
  const uploadRender = (progress)=>{
    return(
      <div className="flex flex-col items-center">
        <p className="w-[24rem] text-black-3 text-2xl text-center mb-10">Publishing & Uploading to IPFS Please wait...</p>
        <ProgressBar value={progress} />
      </div>
    )
  }
  return(
    <Modal className="p-0">
      <div
        className="bg-white flex min-h-[43.75rem] relative"
      >
        <CommonModalClose onClose={()=>onClose && onClose()} />
        <div className="bg-black w-80 text-white px-8 py-16 text-lg">
          <div className="mb-12 text-2xl font-medium">
            IPFS File Storage Widget
          </div>
          {
            storageState === 3?
              <div className="text-lg">
                <div className="mb-5 font-medium">Demo Step 2:</div>
                <p className="font-light text-base">
                  When Upload process is completed, you will get an IPFS CID (unique identifier to your stored content) and a Storage Manager Tx No. (Tx No. for the IPFS storage action of your content).
                </p>
              </div>:
              <div className="text-lg">
                <div className="mb-5 font-medium">Demo Step 1:</div>
                <p className="mb-5 font-light">
                  Drag and drop a file into the box.
                </p>
                <p className="font-light">
                  When you finish, click on the <span className="font-semibold">'Upload'</span> button to continue.
                </p>
              </div>
          }
        </div>
        <div className="min-w-[57.5rem] flex justify-center items-center">
          {
            storageState === 3?
              <div className="text-center text-black-3 flex flex-col items-center">
                <Icon className="text-[3.125rem] text-black mb-4" icon={AiOutlineCheckCircle} />
                <div className="text-[1.375rem] text-black font-semibold mb-4">Publish successfully！</div>
                <p className="mb-14 text-lg">This content has been published and decentralized stored on IPFS.</p>
                <div className="mb-2 text-lg">Your content's IPFS CID:</div>
                <p className="text-sm text-gray-7 mb-8">{storageData.Hash}</p>
                <div className="mb-2 text-lg">Storage Manager Tx No:</div>
                <p className="text-sm text-gray-7">{shortStr('0x69b9f8cf491b55c485dbb43a86a7e48f7649aa45c958cd245461d04c3146bd91', 23, 23)}</p>
              </div>:
              <DragUpload uploadRender={uploadRender} onSuccess={onStorageUploadSuccess} uploadBorder={false} className="h-[32.937rem] w-[50.5rem]" />
          }
        </div>
      </div>
    </Modal>
  )
}