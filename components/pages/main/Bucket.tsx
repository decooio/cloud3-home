import { Button } from "@components/common/Button";
import { Icon } from "@components/common/Icon";
import React from "react";
import { BsBucket } from "react-icons/bs";
import { FiChevronRight, FiSearch } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "./MainLayout";

export const Bucket = React.memo(() => {
  const { bucketId } = useParams();
  const push = useNavigate();
  return (
    <MainLayout menuId={1}>
      <div className="flex-1 h-full flex flex-col">
        <div className="p-8  text-lg border-b-8 border-solid border-[#eeeeee]">
          <div className="flex items-center py-5 mb-2">
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
          <div className=" border border-black-1 border-solid px-8 pt-6 pb-5">
            <div className=" text-xl font-medium">Guidance on Storage</div>
            <div className=" mt-4">
              Files can be uploaded and decentralized pinned to IPFS by using
              this web interface, or by CLI as shown in the curl sample below.
            </div>
            <img
              className=" mt-3"
              alt="Ipfs code"
              src="/images/ipfs_code.png"
            />
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
        <div className="p-8 text-lg v-full">
          <div className="w-full flex justify-center">
            <Button text="Upload" />
            <span>Thundergateway Seattle, US</span>
            <div className="flex-1" />
            <div className="relative w-1/2 h-14 max-w-sm border-solid border-black-1 border rounded overflow-hidden">
              <input className="w-full h-full pl-5 pr-10 active:border-0" />
              <Icon
                icon={FiSearch}
                className="text-2xl absolute top-4 right-2"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
});
