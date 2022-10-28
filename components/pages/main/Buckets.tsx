import { Button } from "@components/common/Button";
import { LoadingText } from "@components/common/Loading";
import { W3Bucket_Adress } from "@lib/config";
import { useGetAuthForGet } from "@lib/hooks/useGetAuth";
import { BucketDTO, genUrl, getResData, Res } from "@lib/http";
import { etherscanAddress, formatW3BucketCapacity, genBucketId, ipfsUrl, ipnsUrl } from "@lib/utils";
import axios from "axios";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAsync } from "react-use";
import { useAccount, useNetwork } from "wagmi";
import { MainLayout } from "./MainLayout";

const BucketCard = React.memo((p: { data: BucketDTO }) => {
  const { data } = p;
  const push = useNavigate();
  const capacityInGb = useMemo(
    () => data.maxStorageSize / 1024 / 1024 / 1024,
    [data]
  );
  const max = useMemo(
    () => formatW3BucketCapacity(capacityInGb),
    [capacityInGb]
  );
  const used = useMemo(
    () => formatW3BucketCapacity(data.usedStorageSize / 1024 / 1024 / 1024, 2),
    [data]
  );
  const bucketId = useMemo(
    () => genBucketId(capacityInGb, data.tokenId),
    [data, capacityInGb]
  );
  const onClickBucket = () => {
    push(`/bucket/${bucketId}/${data.ipnsId}`);
  };
  return (
    <div className=" h-min p-5 border border-solid border-black-1">
      <img className="w-full aspect-[360/531] object-contain" src={ipfsUrl(data.metadata.image.replace('ipfs://',''))} />
      <div className=" text-lg mt-[0.625rem]">{`W3BUCKET(${bucketId})`}</div>
      <div className="flex text-sm my-[2px] justify-between">
        <div>Current Usage</div>
        <div>
          <span className="text-orange-15">{used}</span>
          /{max}
        </div>
      </div>
      <div className="flex text-sm my-[2px] justify-between">
        <div>Files</div>
        <div>{`${data.fileCount}Files`}</div>
      </div>
      <div className="flex text-sm my-[2px] justify-between">
        <div>Created</div>
        <div>{moment(data.mintTimestamp * 1000).format('YYYY-MM-DD')}</div>
      </div>
      <div className="flex text-xs my-2 justify-between">
        <a className=" text-blue-3" target="_blank" href={ipnsUrl(data.ipnsId)}>
          IPNS Link
        </a>
        <a className=" text-blue-3" target="_blank" href={etherscanAddress(W3Bucket_Adress)}>
          View NFT Contract
        </a>
        <a className=" text-blue-3" target="_blank" href={ipfsUrl(data.metadataCid)}>
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
  const { chain } = useNetwork();
  const chainId = chain && chain.id;
  const { address } = useAccount();
  const [getAuth] = useGetAuthForGet();
  const { value: buckets, loading } = useAsync(async () => {
    const auth = await getAuth();
    const res = await axios.get<Res<BucketDTO[]>>(genUrl("/auth/bucket/list"), {
      headers: { Authorization: `Bearer ${auth}` },
    });
    return getResData(res);
  }, [chainId, address]);
  const push = useNavigate();
  const onNewBucket = useCallback(() => push("/mint"), [push]);
  return (
    <MainLayout menuId={1}>
      <div className="flex-1 h-full overflow-y-auto">
        <div className="px-8 relative pb-8">
          <div className="sticky top-0 pt-10 bg-white ">
            <div className=" w-full flex justify-between pb-5  whitespace-nowrap ">
              <div className=" inline-block text-2xl self-center font-medium h-min">
                Your W3Buckets({buckets?.length || 0})
              </div>
              <Button
                className="whitespace-nowrap w-max"
                text="Mint a New W3Bucket"
                onClick={onNewBucket}
              />
            </div>
            <div className="h-5 border-t-1 border-solid border-black-1" />
          </div>
          {buckets && !loading && <div className="w-full overflow-y-auto gap-5 grid grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
            {buckets.map((b, index) => (
              <BucketCard data={b} key={`bucket_${index}`} />
            ))}
          </div>}
          
        </div>
        { loading && <LoadingText className=" h-[calc(100%_-_11rem)] justify-center"/>}
      </div>
    </MainLayout>
  );
});
