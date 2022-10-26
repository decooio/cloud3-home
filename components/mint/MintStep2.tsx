import { BucketImage, MintColors } from "@components/common/BucketImage";
import { Button } from "@components/common/Button";
import { LoadingText } from "@components/common/Loading";
import { QRCodeStyles } from "@components/common/QRCode";
import { upload } from "@lib/files";
import { useLock, useOn, useSafeState } from "@lib/hooks/tools";
import { BucketEdition } from "@lib/hooks/useBucketEditions";
import { useGetAuth } from "@lib/hooks/useGetAuth";
import { useMintData } from "@lib/hooks/useMintData";
import { GenIPNS, genUrl, getResData, Res } from "@lib/http";
import { shortStr } from "@lib/utils";
import axios from "axios";
import classNames from "classnames";
import { toBlob } from "html-to-image";
import _ from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo, useState
} from "react";
import { OnNext } from "./type";
export interface MintStep2Props {
  editions: BucketEdition[];
  onNext: OnNext;
}

function TipIpns(p: { ipns: string; onContinue: () => void }) {
  const { ipns, onContinue } = p;
  const [showNext, setShowNext] = useState(false);
  return (
    <div className="pl-12 flex-1 break-all">
      <div className="p-8 border-solid border-black-1 border flex flex-col">
        <div className=" font-medium text-xl mb-4">Tips:</div>
        <div className="text-lg">
          This is the QR Code of the{" "}
          <span className="font-semibold">IPNS name</span> for this W3Bucket.
          This IPNS name is a <span className="font-semibold">unique</span> and{" "}
          <span className="font-semibold">immutable</span> identifier on IPFS
          that <span className="font-semibold">permanently</span> points to the
          storage history (a .json file, also acts as the list of the bucket
          storage) of this W3Bucket.
        </div>
        <div className="text-lg mt-7">
          You can always fetch the storage history via any IPFS gateway or IPFS
          node.
        </div>
        <Button
          text="Got it"
          className=" mt-8 self-center"
          onClick={() => setShowNext(true)}
        />
      </div>
      {showNext && (
        <div className=" mt-10 text-xl flex flex-col">
          <div>{ipns}</div>
          <div className=" font-medium">
            The IPNS name for this W3Bucket has successfully generated and
            published to IPFS.
          </div>
          <Button
            text="Continue"
            className=" mt-6 self-center"
            onClick={onContinue}
          />
        </div>
      )}
    </div>
  );
}
const colors = _.keys(MintColors);
function SetStyle(p: { onContinue: () => void }) {
  const { onContinue } = p;
  const [mintData, updateMint] = useMintData();
  return (
    <div className="px-20 flex-1 flex flex-col justify-center">
      <div className="flex">
        <div className=" mr-10">Background Color</div>
        <div className=" flex items-center">
          {colors.map((key) => (
            <div
              key={`mint_colors_${key}`}
              style={{ backgroundColor: MintColors[key][0] }}
              onClick={() => updateMint({ color: key })}
              className={classNames(
                "rounded-xl w-5 h-5 overflow-hidden cursor-pointer mr-[1.875rem]",
                {
                  "border-solid border-orange-15 border":
                    mintData.color === key,
                }
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex mt-8">
        <div className=" mr-16 whitespace-nowrap">QR Code Style</div>
        <div className="flex items-center flex-wrap">
          {QRCodeStyles.map((key) => (
            <span
              key={`mint_colors_${key}`}
              onClick={() => updateMint({ qrcode: key })}
              className={classNames(
                " whitespace-nowrap rounded-md px-2 py-1 overflow-hidden cursor-pointer mr-[1rem] bg-slate-50",
                {
                  "border-solid border-orange-15 border":
                    mintData.qrcode === key,
                }
              )}
            >
              {key}
            </span>
          ))}
        </div>
      </div>
      <Button
        text="Continue"
        className=" mt-16 self-center"
        onClick={onContinue}
      />
    </div>
  );
}

function TupleInfo(p: { data: [string, string] }) {
  const {
    data: [title, value],
  } = p;
  return (
    <>
      <div className=" text-sm mt-3">{title}:</div>
      <div className=" text-sm text-gray-7">{value}</div>
    </>
  );
}
function PreMetadata(p: { onContinue: OnNext }) {
  const { onContinue } = p;
  const [mintData, updateMint] = useMintData();
  const [uping, setUping] = useSafeState(false);
  const upMeta = useOn(() => {
    if (uping) return;
    const bucketEle = document.getElementById("generate_bucket_image");
    if (!bucketEle) return;
    setUping(true);
    toBlob(bucketEle)
      .then((content) => upload(content, "bucket_image.png"))
      .then((image) => {
        // to Generate metadata
        // uuid , image cid
        console.info("image:", image);
        updateMint({
          metadataCID: "Qmlaksjdlkjflkjasjdkljlfjkljaklsjlkdjflkja",
          metadataTX:
            "0xalksjdkljfkljalksjkdjfkljklajslkjkldjlkjfljasjkldjklfjasjkljdfkla",
          metadata: {
            name: "W3Bucket",
            description: "description for W3Bucket",
            image: image.Hash,
            external_url: `https://ipfs-scan.io?cid=${image.Hash}`,
            file_history: `ipns://${mintData.ipns}`,
            attributes: [
              { trait_type: "dStorage Platform", value: "Crust" },
              { trait_type: "Edition", value: mintData.editionId + "" },
              { trait_type: "Capacity (GB)", value: "1024" },
            ],
            dStorage: {
              platform: "Crust",
              description: "Crust Network, the Incentive Layer of IPFS",
              persistence_mechanism: "contract-based",
              challenge_mechanism: "mpow",
              consensus: "gpos",
              dstorage_note:
                "0x466ab180124de1718d30cd2e018e7fe013a07c4860674110ccd13e97eb31ae16",
            },
          },
        });
      })
      .catch(console.error)
      .then(() => setUping(false));
  });
  const [showNext, setShowNext] = useSafeState(false);
  return (
    <>
      {!mintData.metadata && !uping && (
        <div className="px-12 flex-1 flex flex-col items-center justify-center">
          <div className=" text-2xl">
            The metadata file (including this profile image) for your W3Bucket
            NFT has been fully generated. Click the Continue button to process
            decentralized storage for the metadata.
          </div>
          <Button
            text="Continue"
            className=" mt-8 self-center"
            onClick={upMeta}
          />
        </div>
      )}
      {uping && (
        <LoadingText
          className="px-12 flex-1 justify-center"
          text="The NFT metadata is being decentralized stored and it will be the very first file stored in this W3Bukcet! Please wait..."
        />
      )}
      {mintData.metadata && !uping && (
        <div className="px-12 flex-1 flex flex-col items-center">
          <div className="p-8 w-full border-solid border-black-1 border flex flex-col">
            <div className=" font-medium text-xl mb-4">Tips:</div>
            <div className="flex">
              <div className="flex-1 mr-8">
                <div className="font-semibold text-lg">
                  NFT Metadata.json file
                </div>
                <TupleInfo
                  data={["IPFS CID", shortStr(mintData.metadataCID, 10, 10)]}
                />
                <TupleInfo
                  data={[
                    "Crust Network Storage Order TXID",
                    shortStr(mintData.metadataTX),
                  ]}
                />
                <TupleInfo data={["IPNS", shortStr(mintData.ipns)]} />
                <TupleInfo data={["Storage Protocol", "Crust"]} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">NFT profile image</div>
                <TupleInfo
                  data={[
                    "IPFS CID",
                    shortStr(mintData.metadata.image.replace("ipfs://", "")),
                  ]}
                />
                <TupleInfo
                  data={[
                    "Crust Network Storage Order TXID",
                    shortStr(mintData.metadata.dStorage.dstorage_note),
                  ]}
                />
                <div className=" font-medium mt-6">
                  You can check them later in the W3Bucket description
                  information.
                </div>
                <Button
                  text="Got it"
                  className=" mt-3 self-center"
                  onClick={() => setShowNext(true)}
                />
              </div>
            </div>
          </div>
          {showNext && (
            <div className=" mt-10 text-xl flex flex-col">
              <div className=" font-medium">
                Congrats! The metadata of this W3Bucket is fully processed. You
                will soon get this truly Web3 storage bucket NFT! Click the
                Continue button to the last step.
              </div>
              <Button
                text="Continue"
                className=" mt-6 self-center"
                onClick={() => onContinue()}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export const MintStep2 = React.memo((p: MintStep2Props) => {
  const { editions, onNext } = p;
  const [mintData, updateMint] = useMintData();
  const currentEditionId = mintData.editionId;
  const currentEdition = useMemo(
    () => editions.find((item) => item.id === currentEditionId),
    [editions, currentEditionId]
  );
  const [step, setStep] = useSafeState(0);
  const mOnNext = useCallback(() => setStep((o) => o + 1), [setStep]);
  const ipns = mintData.ipns;
  const [getAuth] = useGetAuth("for_mint");
  const [, lockFn] = useLock();
  useEffect(() => {
    if (!ipns) {
      lockFn(() =>
        getAuth(undefined, true)
          .then((auth) =>
            axios
              .post<Res<GenIPNS>>(genUrl("/auth/ipns/gen"), null, {
                headers: { Authorization: `Bearer ${auth}` },
              })
              .then(getResData)
          )
          .then((data) => {
            updateMint({
              ipns: data.ipnsId,
              uuid: data.uuid,
            });
            setStep(1);
          })
          .catch(() => {
            onNext(-1);
          })
      );
    } else if (ipns) {
      setStep((o) => (o === 0 ? 1 : o));
    }
  }, [ipns]);
  return (
    <div className=" px-10 pt-9 flex">
      <BucketImage size={currentEdition.capacityInGb} />
      {step === 0 && (
        <LoadingText
          className=" self-center text-center p-9"
          text="Generating a unique IPNS name for this W3Bucket... Please wait."
        />
      )}
      {step === 1 && <TipIpns ipns={ipns} onContinue={mOnNext} />}
      {step === 2 && <SetStyle onContinue={mOnNext} />}
      {step === 3 && <PreMetadata onContinue={onNext} />}
    </div>
  );
});
