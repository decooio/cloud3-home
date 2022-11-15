import { Button } from "@components/common/Button";
import { ProgressBar } from "@components/common/ProgressBar";
import HomeBg from "@components/homebg";
import { IS_LOCAL } from "@lib/env";
import { getClientHeight, openExtUrl } from "@lib/utils";
import axios, {CancelTokenSource} from "axios";
import classNames from "classnames";
import React, {useEffect, useMemo, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import CloseBtnSvg from "../../../public/images/close_btn.svg";
import {upload} from "@lib/files";
import {useOnce} from "@react-spring/shared";
import {useToast} from "@lib/hooks/useToast";

export interface UploadRes {
  Hash: string;
  Size: string;
  Name: string;
  items?: UploadRes[];
}
export const SectionTop = React.memo(() => {
  const [visibleDropUpload, setVisibleDropUpload] = useState(false);
  const [uploadFileInfo, setUploadFileInfo] = useState(null);
  const [upState, setUpState] = useState({ progress: 0, status: 'stop' });
  const uploadRef = useRef(null);
  const inputFileRef = useRef(null);
  const waitUploadRef = useRef(null);
  const [cancelUp, setCancelUp] = useState<CancelTokenSource | null>(null);
  const { address: account } = useAccount();
  const toast = useToast();
  useOnce(()=>{
    setTimeout(()=>{
      window.scroll(0, 0);
    },50)
  })
  const openDropUpload = () => {
    setVisibleDropUpload(true);
    setTimeout(() => {
      window.scroll(0, getClientHeight());
    }, 0);
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
      inputFileRef.current.value = '';
      setUploadFileInfo(upRes);
    } catch (e) {
      console.error(e);
    }
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
  const onOpenUpload = async () => {
    if (upState.status === 'stop') {
      inputFileRef.current.click();
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
    setVisibleDropUpload(false);
    setUploadFileInfo(null);
    window.scroll(0, 0);
  };
  const push = useNavigate();
  return (
      <div className="w-full min-h-min">
        {/* Anim BG */}
        <div className="w-full bg-black h-screen absolute left-0 top-0 z-0">
          <HomeBg />
        </div>
        {/* Content */}
        <div className="z-1 h-[100vh] relative w-full py-6 px-12 flex flex-col items-center">
          <div className="h-14 w-full flex justify-between items-center font-WorkSans">
            <div className="font-SquadaOne text-4xl">Cloud3.cc</div>
            <Button text="Documentations" onClick={()=>openExtUrl('https://docs.cloud3.cc/')} className="border-white text-white" />
          </div>
          <div className="h-full my-10 w-[69.5rem] flex flex-col justify-center mt-[-1rem]">
            <div className="text-5xl leading-tight">
              <p>Store in IPFS W3Bucket,</p>
              <p>Decentralized, Guaranteed & Alive.</p>
            </div>
            <div className="flex mt-12 pl-1">
              <Button
                  text="Quick Start"
                  onClick={openDropUpload}
                  className="border-white text-white"
              />
              <Button
                  text="Launch App"
                  className=" ml-3 border-white text-white"
                  onClick={() =>
                      IS_LOCAL ? openExtUrl("/#/buckets") : openExtUrl("/#/buckets")
                  }
              />
            </div>
          </div>
        </div>
        <div
            className={classNames(
                "w-full flex justify-center",
                visibleDropUpload ? "block" : "hidden"
            )}
        >
          <div
              ref={uploadRef}
              onClick={onOpenUpload}
              className="cursor-pointer relative flex justify-center items-center border-black-1 border-4 border-dashed h-[28.937rem] w-[69.5rem] mt-12"
          >
            <CloseBtnSvg
                className="absolute z-10 right-2 top-2 cursor-pointer"
                onClick={onCloseDragUpload}
            />
            {upState.status !=='stop'? (
                upState.status ==='upload' ? (
                    <div className="w-full px-20">
                      <ProgressBar value={upState.progress} />
                    </div>
                ) : (
                    <div className="text-slate-700 text-lg flex flex-col px-20">
                      <label className="text-xl font-medium text-black">
                        IPFS CID:
                      </label>
                      <span className="mt-5">{uploadFileInfo.Hash}</span>
                      <div className="mt-20">
                        <label className="text-xl font-medium text-black">
                          You may want to:
                        </label>
                        <div className="flex flex-wrap mt-5">
                          <div className="mr-5 w-1/2 mb-2 underline" onClick={()=>openExtUrl(`https://crustwebsites.net/ipfs/${uploadFileInfo.Hash}`)}>
                            Get download link for this file
                          </div>
                          <div className="underline" onClick={()=>openExtUrl(`https://ipfs-scan.io/?cid=${uploadFileInfo.Hash}`)}>Verify on IPFS</div>
                          <div className="mr-5 w-1/2 underline" onClick={()=>openExtUrl(`https://docs.cloud3.cc`)}>
                            Learn more about Cloud3's storage solution
                          </div>
                          <div
                            onClick={() =>
                              openExtUrl("http://test.cloud3.cc/#/buckets")
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
                                    ref={waitUploadRef} id="waitUpload" className="text-black text-4xl font-Roboto tracking-wider">
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
      </div>
  );
});
