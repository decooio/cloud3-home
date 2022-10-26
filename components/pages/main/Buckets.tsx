import { Button } from "@components/common/Button";
import { genBucketId } from "@lib/utils";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "./MainLayout";

export interface BucketDTO {}

const BucketCard = React.memo((p: { data: BucketDTO }) => {
  const { data } = p;
  const push = useNavigate();
  const onClickBucket = () => {
    const bucketId = genBucketId(1024, '1000003')
    push(`/bucket/${bucketId}`);
  };
  return (
    <div className=" h-min p-5 border border-solid border-black-1">
      <img className="w-full aspect-[3/2] " src={"/images/profile.jpg"} />
      <div className=" text-lg mt-[0.625rem]">{"W3BUCKET(a3985d-085670)"}</div>
      <div className="flex text-sm my-[2px] justify-between">
        <div>Current Usage</div>
        <div>
          <span className="text-orange-15">{"54GB"}</span>
          {"/100GB"}
        </div>
      </div>
      <div className="flex text-sm my-[2px] justify-between">
        <div>Files</div>
        <div>{"123Files"}</div>
      </div>
      <div className="flex text-sm my-[2px] justify-between">
        <div>Created</div>
        <div>{"2022-09-15"}</div>
      </div>
      <div className="flex text-xs my-2 justify-between">
        <a className="" target="_blank" href="/ipns">
          IPNS Link
        </a>
        <a className="" target="_blank" href="/nft">
          View NFT Contract
        </a>
        <a className="" target="_blank" href="/meta">
          View Metadata
        </a>
      </div>
      <Button
        onClick={onClickBucket}
        className="!w-full mt-[2px] text-lg"
        text="Enter W3Bucket"
      />
    </div>
  );
});

export const Buckets = React.memo(() => {
  const buckets = useMemo(
    () => [
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ],
    []
  );
  const push = useNavigate();
  const onNewBucket = useCallback(() => push("/mint"), [push]);
  return (
    <MainLayout menuId={1}>
      <div className="flex-1 h-full overflow-y-auto">
        <div className="px-8 relative">
          <div className="sticky top-0 pt-10 bg-white ">
            <div className=" w-full flex justify-between pb-5  whitespace-nowrap ">
              <div className=" inline-block text-2xl self-center font-medium h-min">
                Your W3Buckets({buckets.length})
              </div>
              <Button
                className="whitespace-nowrap w-max"
                text="Mint a New W3Bucket"
                onClick={onNewBucket}
              />
            </div>
            <div className="h-5 border-t-1 border-solid border-black-1" />
          </div>
          <div className="w-full overflow-y-auto gap-5 grid grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
            {buckets.map((b, index) => (
              <BucketCard data={b} key={`bucket_${index}`} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
});
