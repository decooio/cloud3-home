import { Button } from "@components/common/Button";
import { BucketEdition } from "@lib/hooks/useBucketEditions";
import React from "react";

export interface MintStep3Props {
  editions: BucketEdition[];
}

export const MintStep3 = React.memo((p: MintStep3Props) => {
  const { editions } = p;
  return (
    <div className=" px-10 pt-9">
      
      <Button text="Next Step" className="mt-12" />
    </div>
  );
});
