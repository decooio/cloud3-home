import { Button } from "@components/common/Button";
import HomeBg from "@components/homebg";
import React from "react";

export const SectionTop = React.memo(() => {
  return (
    <div className="w-full h-screen min-h-min bg-black">
      {/* Anim BG */}
      <div className="w-full h-full absolute left-0 top-0 z-0">
        <HomeBg />
      </div>
      {/* Content */}
      <div className="z-1 relative w-full h-full py-6 px-12 flex flex-col items-center">
        <div className=" h-14 w-full flex justify-between items-center font-WorkSans">
          <div className="font-SquadaOne text-4xl">Cloud3.cc</div>
          <Button text="Documentations" className=" border-white text-white" />
        </div>
        <div className="my-10 w-2/3 flex flex-col justify-center mt-[23vh]">
          <div className="text-5xl leading-tight">
            <p>Store in IPFS W3Bucket,</p>
            <p>Decentralized, Guaranteed & Alive.</p>
          </div>
          <div className="flex mt-12">
            <Button text="Quick Start" className="border-white text-white" />
            <Button
              text="Launch App"
              className=" ml-3 border-white text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
