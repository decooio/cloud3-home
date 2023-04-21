import classNames from "classnames";
import CloseBtnSvg from "@public/images/close_btn.svg";
import {ProgressBar} from "@components/common/ProgressBar";
import {openExtUrl} from "@lib/utils";
import {GatewayBase} from "@lib/config";
import React, {useEffect, useRef, useState} from "react";
import axios, {CancelTokenSource} from "axios";
import {upload} from "@lib/files";
import {UploadRes} from "@components/pages/home/SectionTop";
import {useToast} from "@lib/hooks/useToast";

interface IProps{
  className?: string,
  onClose?: any
  uploadRender?: any
  uploadBorder?: boolean,
  onSuccess?: any,
  id?: string
}
export function DragUpload(p:IProps){
  const {className,onClose,uploadRender,uploadBorder=true,onSuccess,id=''} = p
  const toast = useToast();
  const [upState, setUpState] = useState({ progress: 0, status: 'stop' });
  const uploadRef = useRef(null);
  const inputFileRef = useRef(null);
  // const waitUploadRef = useRef(null);
  const [cancelUp, setCancelUp] = useState<CancelTokenSource | null>(null);
  const [uploadFileInfo, setUploadFileInfo] = useState(null);
  const onOpenUpload = async () => {
    if (upState.status === 'stop') {
      inputFileRef.current.click();
    }
  };
  useEffect(() => {
    if (uploadRef.current) {
      const drag = uploadRef.current;
      drag.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      drag.addEventListener("dragenter",async()=>{
        if(drag.querySelector('#waitUpload')){
          drag.style.borderColor = '#FC7823'
        }
      })
      drag.addEventListener("dragleave",async()=>{
        drag.style.borderColor = '#131521'
      })
      drag.addEventListener("drop", async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (drag.querySelector('#waitUpload')) {
          drag.style.borderColor = '#131521'
          if(e.dataTransfer.files.length>1 || !/\.[a-zA-Z]+$/.test(e.dataTransfer.files[0].name)){
            toast.error('Folders are not supported!');
            return false
          }
          const [file] = e.dataTransfer.files;
          if(!file){
            toast.error('Please select a file.');
            return false
          }
          const fileSize = file.size / (1024 * 1024);
          if (fileSize > 100) {
            toast.error('Please select a file less than 100MB.');
            return;
          }
          await doUpload(file);
        }
      });
    }
  }, []);
  const doUpload = async (cFile?: any) => {
    try {
      const base64Signature =
        "ZXRoLTB4MEVDNzJGNEQ5MWVhN2ZiRjAyZTY2NUQzZDU5QzQ3MmVjY2M0ZWZFZDoweDc3NDdmNDkxMWNhOWY2YWJjODE0MTgxZTkzZmM1YjdlNzQ4MGIwYzM0ZGRmOWFmNGQ4NjQ3OTRiZmYzY2EzMTg2MzQyNWEwZDRjZjAyOTA1Mjc5MTIwNDliYjJlYTRkMTM1OGZlZjQ3ZDU4YzBmMTQxNjI3ZmMzMTIwNzMwODdjMWI=";
      const AuthBasic = `Basic ${base64Signature}`;
      const cancel = axios.CancelToken.source();
      setCancelUp(cancel);
      setUpState({ progress: 0, status: 'upload' });
      inputFileRef.current.value = '';
      const form = new FormData();
      const upFile = cFile;
      if (upFile && upFile.name) {
        form.append("file", upFile, upFile.name);
      } else {
        return false;
      }
      const upResult = await upload({
        data: form,
        authBasic: AuthBasic,
        cancelToken: cancel.token,
        onProgress: (num)=>{
          setUpState({ progress: Math.round(num * 99), status: 'upload' });
        }
      })
      setCancelUp(null);
      let upRes: UploadRes;
      upRes = upResult;
      setUpState({ progress: 100, status: 'success' });
      setUploadFileInfo(upRes);
      onSuccess && onSuccess(upRes)
    } catch (e) {
      console.error(e);
    }
  };
  const onCloseDragUpload = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if(cancelUp){
      cancelUp.cancel("CanceledError")
      setCancelUp(null)
    }
    setUpState({ progress: 0, status: 'stop' });
    onClose && onClose();
    setUploadFileInfo(null);
  };
  const onUploadChange = async (e) => {
    const file = e.target.files[0]
    if(!file){
      toast.error('Please select a file.');
      return false
    }
    // const [file] = e.dataTransfer.files;
    const fileSize = file.size / (1024 * 1024);
    if (fileSize > 100) {
      toast.error('Please select a file less than 100MB.');
      return;
    }
    await doUpload(file);
  };
  return(
    <div
      id={id}
      className={classNames(
        "w-full flex justify-center",
        className
      )}
    >
      <div
        ref={uploadRef}
        onClick={onOpenUpload}
        className={classNames("w-full h-full cursor-pointer relative max-w-[70rem] flex justify-center items-center border-black-1 border-4 border-dashed")}
        style={!uploadBorder && upState.status === 'upload'?{border:'none'}:{}}
      >
        {
          onClose &&
          <CloseBtnSvg
            className="absolute z-10 right-2 top-2 cursor-pointer"
            onClick={onCloseDragUpload}
          />
        }
        {upState.status !=='stop'? (
          upState.status ==='upload' ? (
            <div className={classNames("w-full", { "px-5": !!uploadRender, 'px-20': !uploadRender })}>
              {
                uploadRender? uploadRender(upState.progress):<ProgressBar value={upState.progress} />
              }
            </div>
          ) : (
            <div className="text-black-3 text-lg flex flex-col px-20">
              <label className="text-xl font-medium text-black">
                IPFS CID:
              </label>
              <span className="mt-5">{uploadFileInfo.Hash}</span>
              <div className="mt-20">
                <label className="text-xl font-medium text-black">
                  You may want to:
                </label>
                <div className="flex flex-wrap mt-5">
                  <div className="mr-5 w-1/2 mb-2 underline" onClick={()=>openExtUrl(`${GatewayBase}/ipfs/${uploadFileInfo.Hash}`)}>
                    Get download link for this file
                  </div>
                  <div className="underline" onClick={()=>openExtUrl(`https://ipfs-scan.io/?cid=${uploadFileInfo.Hash}`)}>Verify on IPFS</div>
                  <div className="mr-5 w-1/2 underline" onClick={()=>openExtUrl(`https://docs.crustcloud.io`)}>
                    Learn more about Crust Cloud's storage solution
                  </div>
                  <div
                    onClick={() =>
                      openExtUrl("http://test.crustcloud.io/#/buckets")
                    }
                    className="underline"
                  >
                    Claim your W3Bucket NFT on testnet
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <span style={{pointerEvents: 'none'}}
                id="waitUpload" className="text-black-1 font-medium text-[2rem] leading-normal">
              Drag and drop your file here
            </span>
        )}
      </div>
      <input
        ref={inputFileRef}
        hidden={true}
        onChange={onUploadChange}
        type="file"
      />
    </div>
  )
}