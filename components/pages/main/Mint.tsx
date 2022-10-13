import { Button } from "@components/common/Button";
import { Icon } from "@components/common/Icon";
import { Steps } from "@components/common/Steps";
import { useSafeState } from "@lib/hooks/tools";
import { useBucketEditions } from "@lib/hooks/useBucketEditions";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "./MainLayout";

export const Mint = React.memo(() => {
  const { value: editions, loading } = useBucketEditions();
  const push = useNavigate();
  const steps = useMemo(
    () => [
      "1.Select your preferred bucket",
      "2.Process NFT metadata",
      "3.Make payment and mint",
    ],
    []
  );
  const [currentStep, setStep] = useSafeState(1);
  return (
    <MainLayout menuId={1}>
      <div className=" flex-1 h-full overflow-y-auto">
        <div className=" relative px-8 pb-10">
          <div className=" sticky top-0 bg-white pt-16 pb-3">
            <div
              className=" flex items-center cursor-pointer"
              onClick={() => push("/buckets")}
            >
              <Icon icon="cru-fo-chevron-left" className=" mr-3" />
              <span>Exit Mint Process</span>
            </div>
            <div className="h-px bg-black-1 my-7" />
            <Steps data={steps} current={currentStep} />
          </div>

          <div className=" px-10 pt-9">
            <div className=" text-2xl">
              Now you are starting to mint a new W3Bucket! First, choose your
              preferred bucket type:
            </div>
            <Button text="W3Bucket" className=" !border-b text-2xl mt-5" />
            <div className=" text-2xl mt-12">
              Select your preferred bucket size:
            </div>
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
        </div>
      </div>
    </MainLayout>
  );
});
