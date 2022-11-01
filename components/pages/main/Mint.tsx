import { Icon } from "@components/common/Icon";
import { LoadingText } from "@components/common/Loading";
import { Steps } from "@components/common/Steps";
import { MintStep1 } from "@components/mint/MintStep1";
import { MintStep2 } from "@components/mint/MintStep2";
import { MintStep3 } from "@components/mint/MintStep3";
import { useSafeState } from "@lib/hooks/tools";
import { useBucketEditions } from "@lib/hooks/useBucketEditions";
import { useGetAuthForMint } from "@lib/hooks/useGetAuth";
import { useMintData } from "@lib/hooks/useMintData";
import { genUrl, getResData, MintState, Res } from "@lib/http";
import axios from "axios";
import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "./MainLayout";

export const Mint = React.memo(() => {
  const { value: editions, loading } = useBucketEditions();
  // useAppLoading(loading);
  const push = useNavigate();
  const steps = useMemo(
    () => [
      "1.Select your preferred bucket",
      "2.Process NFT metadata",
      "3.Make payment and mint",
    ],
    []
  );
  const [currentStep, setStep] = useSafeState(-1);
  const [mintData, updateMint] = useMintData();
  const [getAuth] = useGetAuthForMint();
  useEffect(() => {
    const task = async () => {
      try {
        console.info("do taks:");
        if (!mintData.uuid) return setStep(0);
        const auth = await getAuth();
        const mintstate = await axios
          .get<Res<MintState>>(genUrl(`/auth/bucket/uuid/${mintData.uuid}`), {
            headers: { Authorization: `Bearer ${auth}` },
          })
          .then(getResData);
        let editionId = mintData.editionId;
        if (mintstate.metadata) {
          const trait = mintstate.metadata.attributes.find(
            (item) => item.trait_type === "Edition"
          );
          if (trait) {
            editionId = new Number(trait.value).valueOf();
          }
        }
        updateMint({
          metadata: mintstate.metadata,
          ipns: mintstate.ipnsId,
          metadataTX: mintstate.metadataTxHash,
          metadataCID: mintstate.metadataCid,
          mintTx: mintstate.mintTxHash,
          tokenId: mintstate.tokenId,
          editionId,
        });
        if (mintstate.mintTxHash) {
          setStep(2);
        } else if (mintstate.metadataTxHash) {
          setStep(1);
        } else {
          setStep(0);
        }
      } catch (error) {
        setStep(0);
      }
    };
    task();
    return () => {
      updateMint({}, true);
    };
  }, []);

  const onNext = useCallback(
    (tep: number = 1) => setStep((o) => o + tep),
    [setStep]
  );
  return (
    <MainLayout menuId={1}>
      <div className=" flex-1 h-full overflow-y-auto">
        <div className=" relative px-8 pb-10">
          <div className=" sticky top-0 z-10 bg-white pt-16 pb-3">
            <div
              className=" flex items-center cursor-pointer"
              onClick={() => {
                updateMint({}, true);
                push("/buckets");
              }}
            >
              <Icon icon="cru-fo-chevron-left" className=" mr-3" />
              <span>Exit Mint Process</span>
            </div>
            <div className="h-px bg-black-1 my-7" />
            <Steps data={steps} current={currentStep} />
          </div>
          {editions && (
            <>
              {currentStep === 0 && !loading && (
                <MintStep1 editions={editions} onNext={onNext} />
              )}
              {currentStep === 1 && (
                <MintStep2 editions={editions} onNext={onNext} />
              )}
              {currentStep >= 2 && (
                <MintStep3 editions={editions} onNext={onNext} />
              )}
            </>
          )}
          {(loading || currentStep < 0) && (
            <LoadingText className=" text-black-1 justify-center h-[calc(100vh_-_17.75rem)]" />
          )}
        </div>
      </div>
    </MainLayout>
  );
});
