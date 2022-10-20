import { BucketImage } from "@components/common/BucketImage";
import { Button } from "@components/common/Button";
import { Loading } from "@components/common/Loading";
import { W3Bucket_Adress } from "@lib/config";
import { useOn, useSafeState } from "@lib/hooks/tools";
import { BucketEdition } from "@lib/hooks/useBucketEditions";
import { useMintData } from "@lib/hooks/useMintData";
import { useW3BucketAbi } from "@lib/hooks/useW3BucketAbi";
import { useWeb3Provider } from "@lib/hooks/useWeb3Provider";
import { ERC20Abi__factory } from "@lib/typechain";
import { useAddress } from "@thirdweb-dev/react";
import classNames from "classnames";
import { ContractTransaction, ethers } from "ethers";
import React, { useMemo } from "react";

export interface MintStep3Props {
  editions: BucketEdition[];
}

export const MintStep3 = React.memo((p: MintStep3Props) => {
  const { editions } = p;
  const [mintData, updateMint] = useMintData();
  const currentEditionId = mintData.editionId;
  const currentEdition = useMemo(
    () => editions.find((item) => item.id === currentEditionId),
    [editions, currentEditionId]
  );
  // const [currentPriceIndex, setCurrentPriceIndex] = useSafeState(0)
  const [minting, setMinting] = useSafeState(false);
  const w3b = useW3BucketAbi();
  const provider = useWeb3Provider();
  const account = useAddress();
  const doMint = useOn(() => {
    if (
      minting ||
      !w3b ||
      !account ||
      !mintData.price ||
      !mintData.editionId ||
      !provider
    )
      return;
    setMinting(true);
    const value = ethers.utils.parseUnits(
      mintData.price.fmtPrice,
      mintData.price.decimals
    );
    let task: Promise<ContractTransaction> = null;
    if (
      mintData.price.currency === "0x0000000000000000000000000000000000000000"
    ) {
      task = w3b.mint(
        account,
        mintData.editionId,
        mintData.price.currency,
        `ipfs://${mintData.metadataCID}`,
        { value }
      );
    } else {
      const erc20 = ERC20Abi__factory.connect(
        mintData.price.currency,
        provider.getSigner()
      );
      task = w3b.estimateGas
        .mint(
          account,
          mintData.editionId,
          mintData.price.currency,
          `ipfs://${mintData.metadataCID}`
        )
        .catch(() => 80000)
        .then((gas) =>
          erc20
            .approve(W3Bucket_Adress, value)
            .then(() =>
              w3b.mint(
                account,
                mintData.editionId,
                mintData.price.currency,
                `ipfs://${mintData.metadataCID}`,
                { gasLimit: gas }
              )
            )
        );
    }
    task
      .then((res) => {
        updateMint({ mintTx: res.hash })
      })
      .catch(console.error)
      .then(() => setMinting(false));
  });
  return (
    <div className=" px-10 pt-9 flex">
      <BucketImage size={currentEdition.capacityInGb} />
      {!minting && !mintData.mintTx && (
        <div className="flex flex-1 px-12 flex-col items-center justify-center">
          <div className=" text-2xl">
            Choose your preferred payment method and click the ‘Confirm and Pay’
            button to proceed:
          </div>
          <div className=" flex ">
            {currentEdition.prices.map((price, index) => (
              <div
                key={`edition_price_${index}`}
                className={classNames("mr-4 text-center")}
              >
                <Button
                  text={price.symbol}
                  className={classNames(
                    " !border-2 text-2xl mt-5 !w-48 cursor-pointer",
                    {
                      "!border-orange-15 !text-orange-15":
                        price.currency === mintData.price?.currency,
                    }
                  )}
                  onClick={() => {
                    updateMint({ price: price });
                  }}
                />
                <span className=" text-sm mt-2 font-light">{`${price.fmtPrice} ${price.symbol} payable in 15 min`}</span>
              </div>
            ))}
          </div>
          <Button text="Confirm and Pay" className="mt-12" onClick={doMint} />
        </div>
      )}
      {minting && (
        <div className="flex flex-1 px-12 flex-col items-center justify-center">
          <Loading />
          <div className=" text-2xl">
            Payment Tx sent, please wait for a while to get on-chain
            confirmation...
          </div>
        </div>
      )}
      {!minting && mintData.mintTx && <div></div>}
    </div>
  );
});
