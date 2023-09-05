import { BucketImage } from "@components/common/BucketImage";
import { Button } from "@components/common/Button";
import { LoadingText } from "@components/common/Loading";
import { W3Bucket_Adress } from "@lib/config";
import { useOn, useSafe, useSafeState } from "@lib/hooks/tools";
import { BucketEdition } from "@lib/hooks/useBucketEditions";
import { useGetAuthForMint } from "@lib/hooks/useGetAuth";
import { useMintData } from "@lib/hooks/useMintData";
import { useW3BucketAbi } from "@lib/hooks/useW3BucketAbi";
import { genUrl, getResData, MintState, Res } from "@lib/http";
import {
  bucketEtherscanUrl,
  etherscanTx,
  genBucketId,
  shortStr,
  sleep,
} from "@lib/utils";
import axios from "axios";
import classNames from "classnames";
import { ContractTransaction, ethers } from "ethers";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { erc20ABI, useAccount, useNetwork, useSigner } from "wagmi";
import { getContract } from "wagmi/actions";
import { OnNext } from "./type";

function TulpeText(p: { data: [string, string] | [string, string, string], target?: '_blank'|'_self' }) {
  const {
    data: [tit, value, link],
    target = '_blank',
  } = p;
  return (
    <div className=" flex items-center text-2xl">
      <div className=" mr-2">{tit}:</div>
      {link ? (
        <a
          className=" underline underline-offset-2 !text-black-1"
          target={target}
          href={link}
        >
          {value}
        </a>
      ) : (
        <div className=" underline underline-offset-2">{value}</div>
      )}
    </div>
  );
}
export interface MintStep3Props {
  editions: BucketEdition[];
  onNext: OnNext;
}

export const MintStep3 = React.memo((p: MintStep3Props) => {
  const { editions, onNext } = p;
  const { chain } = useNetwork();
  const chainId = chain && chain.id;
  const [mintData, updateMint] = useMintData();
  const currentEditionId = mintData.editionId;
  const currentEdition = useMemo(
    () => editions.find((item) => item.id === currentEditionId),
    [editions, currentEditionId]
  );
  const [minting, setMinting] = useSafeState(false);
  const w3b = useW3BucketAbi();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [getAuth] = useGetAuthForMint();
  const refSafe = useSafe();
  const doMint = useOn(async () => {
    if (
      minting ||
      !w3b ||
      !address ||
      !mintData.price ||
      !mintData.editionId ||
      !signer
    )
      return;

    setMinting(true);
    const value = ethers.utils.parseUnits(
      mintData.price.fmtPrice,
      mintData.price.decimals
    );
    try {
      const auth = await getAuth();
      const isEth =
        mintData.price.currency ===
        "0x0000000000000000000000000000000000000000";
      let res: ContractTransaction = null;
      if (isEth) {
        res = await w3b.mint(
          address,
          ethers.utils.parseUnits(mintData.editionId + "", 0),
          mintData.price.currency,
          `ipfs://${mintData.metadataCID}`,
          { value }
        );
      } else {
        const erc20 = getContract({
          address: mintData.price.currency,
          abi: erc20ABI,
          signerOrProvider: signer,
        });
        const gas = await w3b.estimateGas
          .mint(
            address,
            ethers.utils.parseUnits(mintData.editionId + "", 0),
            mintData.price.currency,
            `ipfs://${mintData.metadataCID}`
          )
          .catch(() => ethers.utils.parseUnits("396277", 0));
        await erc20.approve(W3Bucket_Adress, value);
        res = await w3b.mint(
          address,
          ethers.utils.parseUnits(mintData.editionId + "", 0),
          mintData.price.currency,
          `ipfs://${mintData.metadataCID}`,
          { gasLimit: gas }
        );
      }
      await res.wait(1)
      let taskRes: MintState = null;
      while (true) {
        if (!refSafe.safe) return;
        taskRes = await axios
          .get<Res<MintState>>(genUrl(`/auth/bucket/uuid/${mintData.uuid}`), {
            headers: { Authorization: `Bearer ${auth}` },
          })
          .then(getResData)
          .catch(() => null);
        if (taskRes && taskRes.tokenId && taskRes.mintTxHash) {
          break;
        }
        await sleep(10000);
      }
      updateMint({ mintTx: taskRes.mintTxHash, tokenId: taskRes.tokenId });
      onNext();
    } catch (error) {
      console.error(error);
    }
    setMinting(false);
  });
  const push = useNavigate();
  const onComplete = useOn(() => {
    updateMint({}, true);
    push("/buckets");
  });
  const bucketId = useMemo(() => {
    if (!mintData.mintTx || !currentEdition || !mintData.tokenId) return "";
    return genBucketId(currentEdition.capacityInGb, mintData.tokenId);
  }, [mintData, currentEdition]);
  return (
    <div className=" px-10 pt-9 flex">
      <BucketImage size={currentEdition.capacityInGb} />
      {!minting && !mintData.mintTx && (
        <div className="flex flex-1 px-12 flex-col items-center justify-center">
          <div className=" text-2xl text-center">
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
                  disHover={price.currency === mintData.price?.currency}
                  className={classNames(
                    "font-medium !border-2 text-2xl mt-5 !w-[11.25rem] !py-[9px] cursor-pointer",
                    {
                      "!border-orange-15 !text-orange-15":
                        price.currency === mintData.price?.currency,
                    }
                  )}
                  onClick={() => {
                    updateMint({ price: price });
                  }}
                />
                <span className=" text-sm mt-2 font-light whitespace-nowrap">{`${price.fmtPrice} ${price.symbol} payable in 15 min`}</span>
              </div>
            ))}
          </div>
          <Button text="Confirm and Pay" className="mt-12 text-lg w-48 h-[3.375rem]" onClick={doMint} />
        </div>
      )}
      {minting && (
        <LoadingText
          className="flex-1 px-12 justify-center"
          text="Payment Tx sent, please wait for a while to get on-chain confirmation..."
        />
      )}
      {!minting && mintData.mintTx && (
        <div className="flex flex-1 px-12 flex-col ">
          <div className=" text-2xl font-medium mb-8">
            Congrats,<br/>You have completed all the minting processes for this
            W3Bucket NFT!
          </div>
          <TulpeText
            data={[
              "W3Bucket NFT Token ID",
              mintData.tokenId,
              bucketEtherscanUrl(chainId, mintData.tokenId),
            ]}
          />
          <TulpeText
            data={[
              "Mint TX ID",
              shortStr(mintData.mintTx, 9, 5),
              etherscanTx(chainId, mintData.mintTx),
            ]}
          />
          <TulpeText target="_self" data={["W3Bucket Identifier", bucketId, `/#/bucket/${bucketId}/${mintData.ipns}`]} />
          <div className=" text-2xl font-medium mt-8">
            Return to the W3Bucket Home Page and start your Crust Cloud journey. Bon
            Voyage!
          </div>
          <Button
            text="Complete"
            className=" self-center text-lg !w-[11.25rem] h-[3.375rem] mt-20"
            onClick={onComplete}
          />
        </div>
      )}
    </div>
  );
});
