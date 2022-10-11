import { Button } from "@components/common/Button";
import React, { useCallback, useMemo } from "react";
import { MainLayout } from "./MainLayout";

export const Buckets = React.memo(() => {
  const buckets = useMemo(() => [], []);
  const onNewBucket = useCallback(() => {}, []);
  return (
    <MainLayout menuId={1}>
      <div className="flex-1 h-full px-8 pt-10 flex flex-col">
        <div className="w-full flex justify-between mb-5 pb-5  whitespace-nowrap border-b-1 border-solid border-black-1">
          <div className=" inline-block text-2xl self-center font-medium h-min">
            Your W3Buckets({buckets.length})
          </div>
          <Button
            className="whitespace-nowrap w-max"
            text="Mint a New W3Bucket"
            onClick={onNewBucket}
          />
        </div>
        <div className="flex1 w-full"></div>
      </div>
    </MainLayout>
  );
});
