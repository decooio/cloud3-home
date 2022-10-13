import { Button } from "@components/common/Button";
import { BucketEdition } from "@lib/hooks/useBucketEditions";
import React from "react";

export interface MintStep2Props {
  editions: BucketEdition[];
}

export const MintStep2 = React.memo((p: MintStep2Props) => {
  const { editions } = p;
  return (
    <div className=" px-10 pt-9">
      
      <Button text="Next Step" className="mt-12" />
    </div>
  );
});
