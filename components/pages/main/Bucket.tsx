import { Button } from "@components/common/Button";
import { Icon } from "@components/common/Icon";
import { useGetAuth } from "@lib/hooks/useGetAuth";
import { parseBucketId } from "@lib/utils";
import React, { useCallback, useMemo } from "react";
import { BsBucket } from "react-icons/bs";
import { FiChevronRight, FiSearch } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useNetwork } from "wagmi";
import { MainLayout } from "./MainLayout";

const TopInfo = () => {
  const { bucketId } = useParams();
  const push = useNavigate();
  return (
    <>
      <div className="sticky top-0 bg-white px-8 pt-16 flex items-center pb-5 mb-2">
        <Icon icon={BsBucket} className="text-xl mr-2" />
        <span
          className="mr-2 cursor-pointer"
          onClick={() => {
            push("/buckets");
          }}
        >
          W3Buckets
        </span>
        <Icon icon={FiChevronRight} className="mr-2" />
        <span>{`W3BUCKET(${bucketId})`}</span>
      </div>
      <div className="px-8 pb-8 text-lg border-b-8 border-solid border-[#eeeeee]">
        <div className=" border border-black-1 border-solid px-8 pt-6 pb-5">
          <div className=" text-xl font-medium">Guidance on Storage</div>
          <div className=" mt-4">
            Files can be uploaded and decentralized pinned to IPFS by using this
            web interface, or by CLI as shown in the curl sample below.
          </div>
          <img className=" mt-3" alt="Ipfs code" src="/images/ipfs_code.png" />
          <div className=" mt-8 text-xl font-medium">Get more references</div>
          <div className=" mt-4 flex flex-wrap">
            <a
              className=" underline text-black-1 mr-5"
              target="_blank"
              href="/general"
            >
              General Dey Guidance
            </a>
            <a
              className=" underline text-black-1 mr-5"
              target="_blank"
              href="/general"
            >
              Hosting Dapps
            </a>
            <a
              className=" underline text-black-1 mr-5"
              target="_blank"
              href="/general"
            >
              NFT Metadata
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export const Bucket = React.memo(() => {
  const { bucketId } = useParams();
  const [ , tokenId] = useMemo(() => parseBucketId(bucketId),[bucketId])
  const push = useNavigate();
  const files = useMemo(
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
    ],
    []
  );
  
  const { chain } = useNetwork();
  const [getAuth] = useGetAuth('for_upload')
  const doSign = useCallback(async () => {
    getAuth(tokenId)
    .then((auth) => console.info('auth:', auth))
    .catch(console.error)
  }, [tokenId]);
  return (
    <MainLayout menuId={1}>
      <div className="flex-1 h-full overflow-y-auto">
        <div className="relative">
          <TopInfo />
          <div className="p-8 flex-1 text-lg v-full flex flex-col">
            <div className="sticky top-[6.5rem] bg-white w-full flex items-center">
              <Button text="Upload" className=" w-44" onClick={doSign} />
              <span className="ml-5">Thundergateway Seattle, US</span>
              <div className="flex-1" />
              <div className="relative w-1/2 h-14 max-w-sm border-solid border-black-1 border rounded overflow-hidden">
                <input className="w-full h-full pl-5 pr-10 active:border-0" />
                <Icon
                  icon={FiSearch}
                  className="text-2xl absolute top-4 right-2"
                />
              </div>
            </div>
            <div className="sticky top-40 bg-white py-4 flex items-center font-medium border-b-1 border-solid border-b-black-1">
              <div className="flex-initial w-2/12 pl-3">File Name</div>
              <div className="flex-initial w-3/12">CID</div>
              <div className="flex-initial w-4/12">Link</div>
              <div className="flex-initial w-1/12">File Size</div>
              <div className="flex-initial w-2/12">TimeStamp</div>
            </div>
            <div className=" text-sm text-gray-6">
              {files.map((f, index) => (
                <div
                  key={`files_${index}`}
                  className="flex items-center pt-4 pb-5"
                >
                  <div className="flex-initial w-2/12 pl-3">File Name</div>
                  <div className="flex-initial w-3/12">CID</div>
                  <div className="flex-initial w-4/12">Link</div>
                  <div className="flex-initial w-1/12">File Size</div>
                  <div className="flex-initial w-2/12">TimeStamp</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
});
