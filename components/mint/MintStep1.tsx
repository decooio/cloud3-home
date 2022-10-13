import { Button } from "@components/common/Button";
import { BucketEdition } from "@lib/hooks/useBucketEditions";
import React from "react";

export interface MintStep1Props {
  editions: BucketEdition[];
}

export const MintStep1 = React.memo((p: MintStep1Props) => {
  const { editions } = p;
  return (
    <div className=" px-10 pt-9">
      <div className=" text-2xl">
        Now you are starting to mint a new W3Bucket! First, choose your
        preferred bucket type:
      </div>
      <Button text="W3Bucket" className=" !border-b text-2xl mt-5" />
      <div className=" text-2xl mt-12">Select your preferred bucket size:</div>
      <div className="flex items-center mt-5">
        {editions.map((item, index) => (
          <div key={`editions_${index}`} className="mr-4">
            <Button
              text={`${item.capacityInGb}GB`}
              className=" !border-b text-2xl mt-5 !w-48"
            />
          </div>
        ))}
      </div>
      <div className=" text-2xl mt-12">
        Your W3Bucket NFT to be minted:{" "}
        <span className=" text-orange-15">W3Bucket</span>,{" "}
        <span className=" text-orange-15">100GB</span>
        <br />
        Payable: 0.4 ETH or 640 USDC
      </div>
      <Button text="Next Step" className="mt-12" />
    </div>
  );
});
