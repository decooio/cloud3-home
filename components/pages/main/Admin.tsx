import { Button } from "@components/common/Button";
import { useBucketEditions } from "@lib/hooks/useBucketEditions";
import { useToast } from "@lib/hooks/useToast";
import { useW3BucketAbi } from "@lib/hooks/useW3BucketAbi";
import React, { useState } from "react";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { MainLayout } from "./MainLayout";

export const Admin = React.memo(() => {
  const { chain } = useAccount();
  const { value: editions, loading, refresh } = useBucketEditions();
  const w3b = useW3BucketAbi();
  const [inputEditions, setInputEditions] = useState("");
  const toast = useToast();
  const onSetEditions = async () => {
    try {
      const eds: any[] = JSON.parse(inputEditions);
      const params = eds.map((e) => ({
        editionId: BigInt(e.editionId),
        capacityInGigabytes: BigInt(e.capacityInGigabytes),
        maxMintableSupply: BigInt(e.maxMintableSupply),
      }));
      await w3b.setBucketEditions([params]);
      toast.success("Success");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const [inputEditionId, setInputEditionId] = useState("");
  const [inputPrices, setInputPrices] = useState("");
  const onSetPrices = async () => {
    try {
      const prices: any[] = JSON.parse(inputPrices);
      const params = prices.map((p) => ({
        currency: p.currency,
        price: parseUnits(p.price, 18),
      }));
      await w3b.setBucketEditionPrices([BigInt(inputEditionId), params]);
      toast.success("Success");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <MainLayout menuId={2}>
      <div className="flex-1 w-full h-full overflow-y-auto flex flex-col gap-4">
        {chain && (
          <>
            <div className="w-full border border-black-1 px-3 py-2 flex flex-col gap-2">
              <div className="">
                {
                  //  editionId: PromiseOrValue<BigNumberish>; capacityInGigabytes: PromiseOrValue<BigNumberish>; maxMintableSupply: PromiseOrValue<BigNumberish>;
                }
                {JSON.stringify(
                  (editions || []).map((e) => ({ editionId: e.id, capacityInGigabytes: e.capacityInGb, maxMintableSupply: e.totalSupply }))
                )}
              </div>
              <div className="font-semibold">Set Editions:</div>
              <input
                className="w-full h-full p-2 border border-black-1"
                value={inputEditions}
                placeholder="Editions Json"
                onChange={(v) => setInputEditions(v.target.value)}
              />
              <Button onClick={onSetEditions} text="Write" />
            </div>

            <div className="w-full border border-black-1 px-3 py-2 flex flex-col gap-2">
              <div className="">
                {editions?.map((e) => (
                  <div>
                    {e.id}: {JSON.stringify(e.prices.map((p) => ({ currency: p.currency, price: p.fmtPrice })))}
                  </div>
                ))}
              </div>
              <div className="font-semibold">Set Prices:</div>
              <input
                className="w-full h-full p-2 border border-black-1"
                value={inputEditionId}
                placeholder="Editions Id"
                onChange={(v) => setInputEditionId(v.target.value)}
              />
              <input
                className="w-full h-full p-2 border border-black-1"
                value={inputPrices}
                placeholder="Edition Price Json"
                onChange={(v) => setInputPrices(v.target.value)}
              />
              <Button onClick={onSetPrices} text="Write" />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
});
