import { Icon } from "@components/common/Icon";
import { Steps } from "@components/common/Steps";
import { MintStep1 } from "@components/mint/MintStep1";
import { MintStep2 } from "@components/mint/MintStep2";
import { MintStep3 } from "@components/mint/MintStep3";
import { useSafeState } from "@lib/hooks/tools";
import { useBucketEditions } from "@lib/hooks/useBucketEditions";
import { useAppLoading } from "@lib/store/useAppLoading";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "./MainLayout";

export const Mint = React.memo(() => {
  const { value: editions, loading } = useBucketEditions();
  useAppLoading(loading)
  const push = useNavigate();
  const steps = useMemo(
    () => [
      "1.Select your preferred bucket",
      "2.Process NFT metadata",
      "3.Make payment and mint",
    ],
    []
  );
  const [currentStep, setStep] = useSafeState(0);

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
          {editions && (
            <>
              {currentStep === 0 && <MintStep1 editions={editions} />}
              {currentStep === 1 && <MintStep2 editions={editions} />}
              {currentStep === 2 && <MintStep3 editions={editions} />}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
});
