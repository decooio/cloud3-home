import { Button } from "@components/common/Button";
import algoWallet from "@lib/algorand/algoWallet";
import { AlgorandChainId } from "@lib/config";
import { BucketEdition } from "@lib/hooks/useBucketEditions";
import { useMintData } from "@lib/hooks/useMintData";
import { formatW3BucketCapacity } from "@lib/utils";
import classNames from "classnames";
import React, { useEffect, useMemo } from "react";
import { useChainId } from "wagmi";
import { OnNext } from "./type";

export interface MintStep1Props {
  editions: BucketEdition[];
  onNext: OnNext;
}

function fmtPrices(prices: BucketEdition["prices"]) {
  return prices.map((p) => p.fmtPrice + " " + p.symbol).join(" or ");
}

export const MintStep1 = React.memo((p: MintStep1Props) => {
  const { editions, onNext } = p;
  let chainId = useChainId()
  if (algoWallet.isConnected()) chainId = AlgorandChainId;
  const [mintData, updateMint] = useMintData();
  useEffect(() => {
    if (mintData.editionId === undefined && editions.length) {
      updateMint({ chainId: chainId, editionId: editions[0].id, price: editions[0].prices[0] });
    }
  }, [mintData, updateMint, editions]);
  const currentEditionId = mintData.editionId;
  const currentEdition = useMemo(
    () => editions.find((item) => item.id === currentEditionId),
    [editions, currentEditionId]
  );

  return (
    <div className=" px-10 pt-9">
      <div className=" text-2xl">
        Now you are starting to mint a new W3Bucket!<br/>
        First, choose your preferred bucket type:
      </div>
      <Button
        text="W3Bucket"
        disHover={true}
        className=" !border-2 !border-orange-15 !text-orange-15 text-2xl py-[9px] !w-[11.25rem] mt-5"
      />
      <div className=" text-2xl mt-12">Select your preferred bucket size:</div>
      <div className="flex items-center mt-5">
        {editions.map((item, index) => (
          <div
            key={`editions_${index}`}
            className={classNames("mr-4 text-center")}
          >
            <Button
              text={formatW3BucketCapacity(item.capacityInGb)}
              disHover={item.id === currentEditionId}
              className={classNames(
                " font-medium !border-2 text-2xl mt-5 !w-[11.25rem] py-[9px] cursor-pointer",
                {
                  "!border-orange-15 !text-orange-15":
                    item.id === currentEditionId,
                }
              )}
              onClick={() => {
                updateMint({ chainId: chainId, editionId: item.id, price: item.prices[0] });
              }}
            />
            <span className=" whitespace-nowrap text-sm mt-2 font-light">{`${fmtPrices(
              item.prices
            )}`}</span>
          </div>
        ))}
      </div>
      {currentEdition && (
        <div className=" text-2xl mt-12">
          Your W3Bucket NFT to be minted:{" "}
          <span className=" text-orange-15">W3Bucket</span>,{" "}
          <span className=" text-orange-15">
            {formatW3BucketCapacity(currentEdition.capacityInGb)}
          </span>
          <br />
          Payable: {fmtPrices(currentEdition.prices)}
        </div>
      )}
      <Button
        text="Next Step"
        className="mt-12 text-lg !w-[11.25rem] !h-[3.375rem]"
        onClick={() => {
          console.info("click:");
          onNext();
        }}
        disabled={!currentEdition}
      />
    </div>
  );
});
