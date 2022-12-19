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
        <p className="w-[26rem] text-2xl text-center mb-10">Publishing & Uploading to IPFS Please wait...</p>
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
          <h4 className="mb-12 text-2xl font-medium">
            IPFS File Storage Widget
          </h4>
          {
            storageState === 3?
              <div>
                <h5 className="mb-5 font-medium">Demo Step 2:</h5>
                <p className="font-light text-base">
                  When Upload process is completed, you will get an IPFS CID (unique identifier to your stored content) and a Storage Manager Tx No. (Tx No. for the IPFS storage action of your content).
                </p>
              </div>:
              <div>
                <h5 className="mb-5 font-medium">Demo Step 1:</h5>
                <p className="mb-5 font-light">
                  Drag and drop a file into the box.
                </p>
                <p className="font-light text-base">
                  When you finish, click on the <span className="font-medium">'Upload'</span> button to continue.
                </p>
              </div>
          }
        </div>
        <div className="min-w-[57.5rem] flex justify-center items-center">
          {
            storageState === 3?
              <div className="text-center text-lg text-black-3 flex flex-col items-center">
                <Icon className="text-5xl mb-4" icon={AiOutlineCheckCircle} />
                <h4 className="text-2xl font-semibold mb-4">Publish successfully！</h4>
                <p className="mb-14">This content has been published and decentralized stored on IPFS.</p>
                <h5 className="mb-2">Your content's IPFS CID:</h5>
                <p className="text-sm text-gray-7 mb-8">{storageData.Hash}</p>
                <h5 className="mb-2">Storage Manager Tx No:</h5>
                <p className="text-sm text-gray-7">{shortStr('0x69b9f8cf491b55c485dbb43a86a7e48f7649aa45c958cd245461d04c3146bd91', 23, 23)}</p>
              </div>:
              <DragUpload uploadRender={uploadRender} onSuccess={onStorageUploadSuccess} uploadBorder={false} className="h-[32.937rem] w-[50.5rem]" />
          }
        </div>
      </div>
    </Modal>
  )
}