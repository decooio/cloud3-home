import { BucketImage } from "@components/common/BucketImage";
import { Button } from "@components/common/Button";
import { Loading } from "@components/common/Loading";
import { useOn, useSafeState } from "@lib/hooks/tools";
import { BucketEdition } from "@lib/hooks/useBucketEditions";
import { useMintData } from "@lib/hooks/useMintData";
import classNames from "classnames";
import React, { useMemo } from "react";

export interface MintStep3Props {
  editions: BucketEdition[];
}

export const MintStep3 = React.memo((p: MintStep3Props) => {
  const { editions } = p;
  const [mintData, updateMint] = useMintData();
  const currentEditionId = mintData.editionId;
  const currentEdition = useMemo(
    () => editions.find((item) => item.id === currentEditionId),
    [editions, currentEditionId]
  );
  const [currentPriceIndex, setCurrentPriceIndex] = useSafeState(0)
  const [minting, setMinting] = useSafeState(false);
  const doMint = useOn(() => {
    if(minting) return;
    

  })
  return (
    <div className=" px-10 pt-9">
      <BucketImage size={currentEdition.capacityInGb} />
      {!minting && !mintData.mintTx && (
        <div className="flex-1 px-12 flex-col items-center justify-center">
          <div className=" text-2xl">
            Choose your preferred payment method and click the ‘Confirm and Pay’
            button to proceed:
          </div>
          <div className=" flex ">
            {currentEdition.prices.map((price, index) => (
              <div
                key={`edition_price_${index}`}
                className={classNames("mr-4 text-center")}
              >
                <Button
                  text={price.symbol}
                  className={classNames(
                    " !border-2 text-2xl mt-5 !w-48 cursor-pointer",
                    {
                      "!border-orange-15 !text-orange-15": index === currentPriceIndex,
                    }
                  )}
                  onClick={() => {
                    setCurrentPriceIndex(index)
                  }}
                />
                <span className=" text-sm mt-2 font-light">{`${price.fmtPrice} ${price.symbol} payable in 15 min`}</span>
              </div>
            ))}
          </div>
          <Button text="Confirm and Pay" className="mt-12" />
        </div>
      )}
      {minting && (
        <div className="flex-1 px-12 flex-col items-center justify-center">
          <Loading />
          <div className=" text-2xl">
            Payment Tx sent, please wait for a while to get on-chain
            confirmation...
          </div>
        </div>
      )}
      {!minting && mintData.mintTx && <div></div>}
    </div>
  );
});
