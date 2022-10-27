import { SetStateAction, useCallback, useMemo } from "react";
import { MintData } from "../type";
import { useStore } from "./../store/store";

const defMintData: MintData = {
  color: "gray",
  qrcode: "A1",
};

export function useMintData(): [
  MintData,
  (data: SetStateAction<Partial<MintData>>, clear?: boolean) => void
] {
  const {
    store: { mintData = defMintData },
    oUpdate,
  } = useStore();
  const updateMintData = useCallback(
    (data: SetStateAction<Partial<MintData>>, clear?: boolean) => {
      if (clear) {
        oUpdate({ mintData: defMintData });
      } else {
        oUpdate(({ mintData }) => ({
          mintData: {
            ...(mintData || defMintData),
            ...(typeof data === "function" ? data(mintData) : data),
          },
        }));
      }
    },
    [oUpdate]
  );
  return useMemo(() => [mintData, updateMintData], [mintData, updateMintData]);
}
