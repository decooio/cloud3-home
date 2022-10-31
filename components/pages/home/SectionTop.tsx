import { Button } from "@components/common/Button";
import { ProgressBar } from "@components/common/ProgressBar";
import HomeBg from "@components/homebg";
import { IS_LOCAL } from "@lib/env";
import { getClientHeight, openExtUrl } from "@lib/utils";
import axios from "axios";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import CloseBtnSvg from "../../../public/images/close_btn.svg";

export interface UploadRes {
  Hash: string;
  Size: string;
  Name: string;
  items?: UploadRes[];
}
export const SectionTop = React.memo(() => {
  const [visibleDropUpload, setVisibleDropUpload] = useState(false);
  const [uploadFileInfo, setUploadFileInfo] = useState(null);
  const [upState, setUpState] = useState({ progress: 0, up: false });
  const uploadRef = useRef(null);
  const inputFileRef = useRef(null);
  const { address: account } = useAccount();
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
        e.stopPropagation();
        e.preventDefault();
      });
      drag.addEventListener("dragenter",async()=>{
        drag.style.borderColor = '#FC7823'
      })
      drag.addEventListener("dragleave",async()=>{
        drag.style.borderColor = '#131521'
      })
      drag.addEventListener("drop", async (e) => {
        e.stopPropagation();
        e.preventDefault();
        drag.style.borderColor = '#131521'
        if (!uploadFileInfo) {
          const [file] = e.dataTransfer.files;
          const fileSize = file.size / (1024 * 1024);
          if (fileSize > 100) {
            console.log("", "e", "用户资料zip文件请不要超过100MB", "消息提醒");
            return;
          }
          await upload(file);
        }
      });
    }
  }, []);
  const upload = async (cFile?: any) => {
    try {
      const base64Signature =
        "ZXRoLTB4MEVDNzJGNEQ5MWVhN2ZiRjAyZTY2NUQzZDU5QzQ3MmVjY2M0ZWZFZDoweDc3NDdmNDkxMWNhOWY2YWJjODE0MTgxZTkzZmM1YjdlNzQ4MGIwYzM0ZGRmOWFmNGQ4NjQ3OTRiZmYzY2EzMTg2MzQyNWEwZDRjZjAyOTA1Mjc5MTIwNDliYjJlYTRkMTM1OGZlZjQ3ZDU4YzBmMTQxNjI3ZmMzMTIwNzMwODdjMWI=";
      const AuthBasic = `Basic ${base64Signature}`;
      const cancel = axios.CancelToken.source();
      setUpState({ progress: 0, up: true });
      const form = new FormData();
      const upFile = cFile;
      if (upFile && upFile.name) {
        form.append("file", upFile, upFile.name);
      } else {
        return false;
      }
      const upResult = await axios.request({
        cancelToken: cancel.token,
        data: form,
        headers: { Authorization: AuthBasic },
        maxContentLength: 1024,
        method: "POST",
        onUploadProgress: (p) => {
          const percent = p.loaded / p.total;
          console.log(percent);
          setUpState({ progress: Math.round(percent * 99), up: true });
        },
        params: { pin: true },
        url: `https://crustwebsites.net/api/v0/add`,
      });

      let upRes: UploadRes;

      if (typeof upResult.data === "string") {
        const jsonStr = upResult.data.replaceAll("}\n{", "},{");
        const items = JSON.parse(`[${jsonStr}]`) as UploadRes[];
        const folder = items.length - 1;

        upRes = items[folder];
        delete items[folder];
        upRes.items = items;
      } else {
        upRes = upResult.data;
      }
      setUpState({ progress: 100, up: false });
      setUploadFileInfo(upRes);
    } catch (e) {
      setUpState({ progress: 0, up: false });
      console.error(e);
      throw e;
    }
  };
  const onUploadChange = async (file) => {
    await upload(file.target.files[0]);
  };
  const onOpenUpload = async () => {
    if (!uploadFileInfo) {
      inputFileRef.current.click();
    }
  };
  const onCloseDragUpload = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setVisibleDropUpload(false);
    setUploadFileInfo(null);
    window.scroll(0, 0);
    return false;
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
          <Button text="Documentations" className="border-white text-white" />
        </div>
        <div className="my-10 w-2/3 flex flex-col justify-center mt-[23vh]">
          <div className="text-5xl leading-tight">
            <p>Store in IPFS W3Bucket,</p>
            <p>Decentralized, Guaranteed & Alive.</p>
          </div>
          <div className="flex mt-12">
            <Button
              text="Quick Start"
              onClick={openDropUpload}
              className="border-white text-white"
            />
            <Button
              text="Launch App"
              className=" ml-3 border-white text-white"
              onClick={() =>
                IS_LOCAL ? push("/buckets") : openExtUrl("/#/buckets")
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
          {upState.up || uploadFileInfo ? (
            upState.up ? (
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
                    <div className="mr-5 w-1/2 mb-2 underline">
                      Get download link for this file
                    </div>
                    <div className="underline">Verify on IPFS</div>
                    <div className="mr-5 w-1/2 underline">
                      View NFT Metadata
                    </div>
                    {!account && (
                      <div
                        onClick={() =>
                          openExtUrl("http://test.cloud3.cc/#/buckets")
                        }
                        className="underline"
                      >
                        Claim your W3Bucket NFT on testnet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            <span className="text-black text-4xl">
              Drag and Drop Your File here
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
