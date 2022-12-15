import { Button } from "@components/common/Button";
import HomeBg from "@components/homebg";
import { IS_LOCAL } from "@lib/env";
import {openExtUrl } from "@lib/utils";
import React, {useState} from "react";
import {useOnce} from "@react-spring/shared";

export interface UploadRes {
  Hash: string;
  Size: string;
  Name: string;
  items?: UploadRes[];
}
export const SectionTop = React.memo(() => {

  useOnce(()=>{
    setTimeout(()=>{
      window.scroll(0, 0);
    },50)
  })

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
          </div>
          <div className="h-full my-10 w-[69.5rem] flex flex-col justify-center mt-[-1rem]">
            <div className="text-5xl leading-tight">
              <p>Store in IPFS W3Bucket,</p>
              <p>Decentralized, Guaranteed & Alive.</p>
            </div>
            <div className="flex mt-12 pl-1">
              <Button
                  text="Documentations"
                  className="border-white text-white"
                  onClick={()=>openExtUrl('https://docs.cloud3.cc/')}
              />
              <Button
                  text="Launch App"
                  className=" ml-3 border-white text-white"
                  onClick={() =>
                      IS_LOCAL ? openExtUrl("/#/buckets", '_self') : openExtUrl("/#/buckets")
                  }
              />
            </div>
          </div>
        </div>
      </div>
  );
});
