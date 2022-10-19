import { BucketImage, MintColors } from "@components/common/BucketImage";
import { Button } from "@components/common/Button";
import { Loading } from "@components/common/Loading";
import { QRCodeStyles } from "@components/common/QRCode";
import { useOn, useSafeState } from "@lib/hooks/tools";
import { BucketEdition } from "@lib/hooks/useBucketEditions";
import { useMintData } from "@lib/hooks/useMintData";
import { shortStr } from "@lib/utils";
import classNames from "classnames";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { toBlob, toPng } from "html-to-image";
import { upload } from "@lib/files";
import { W3BucketMetadata } from "@lib/type";
export interface MintStep2Props {
  editions: BucketEdition[];
  onNext: () => void;
}

function CreateIpns() {
  return (
    <div className=" self-center text-center p-9 flex flex-col items-center">
      <Loading />
      <div className=" text-2xl">
        Generating a unique IPNS name for this W3Bucket... Please wait.
      </div>
    </div>
  );
}

function TipIpns(p: { ipns: string; onContinue: () => void }) {
  const { ipns, onContinue } = p;
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
        <Button text="Got it" className=" mt-8 self-center" />
      </div>
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
function PreMetadata(p: { onContinue: () => void }) {
  const { onContinue } = p;
  const [mintData, updateMint] = useMintData();
  const [uping, setUping] = useSafeState(false);
  const upMeta = useOn(() => {
    if (uping) return;
    const bucketEle = document.getElementById("generate_bucket_image");
    if (!bucketEle) return;
    setUping(true);
    toBlob(bucketEle)
      .then((content) =>
        upload(content, "bucket_image.png")
      )
      .then((image) => {
        // to Generate metadata
        // uuid , image cid
        console.info("image:", image);
      })
      .catch((e) => {
        console.error(e);
        setUping(false);
      });
  });
  return (
    <div className="px-12 flex-1 flex flex-col items-center justify-center">
      {!mintData.metadata && !uping && (
        <>
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
        </>
      )}
      {uping && (
        <>
          <Loading />
          <div className=" text-2xl">
            The NFT metadata is being decentralized stored and it will be the
            very first file stored in this W3Bukcet! Please wait...
          </div>
        </>
      )}
      {mintData.metadata && !uping && (
        <>
          <div className="p-8 border-solid border-black-1 border flex flex-col">
            <div className=" font-medium text-xl mb-4">Tips:</div>
            <div className="flex">
              <div className="flex-1 mr-8">
                <div className="font-semibold text-lg">
                  NFT Metadata.json file
                </div>
                <TupleInfo data={["IPFS CID", "Qmlakjskdjf....alskjdlkjfja"]} />
                <TupleInfo
                  data={[
                    "Crust Network Storage Order TXID",
                    "0x2908348958...29834958",
                  ]}
                />
                <TupleInfo data={["IPNS", "Qmlakjskdjf....alskjdlkjfja"]} />
                <TupleInfo data={["Storage Protocol", "Crust"]} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">NFT profile image</div>
                <TupleInfo data={["IPFS CID", "Qmlakjskdjf....alskjdlkjfja"]} />
                <TupleInfo
                  data={[
                    "Crust Network Storage Order TXID",
                    "0x2908348958...29834958",
                  ]}
                />
                <div className=" font-medium">
                  You can check them later in the W3Bucket description
                  information.
                </div>
                <Button text="Got it" className=" mt-8 self-center" />
              </div>
            </div>
          </div>
          <div className=" mt-10 text-xl flex flex-col">
            <div className=" font-medium">
              Congrats! The metadata of this W3Bucket is fully processed. You
              will soon get this truly Web3 storage bucket NFT! Click the
              Continue button to the last step.
            </div>
            <Button
              text="Continue"
              className=" mt-6 self-center"
              onClick={onContinue}
            />
          </div>
        </>
      )}
    </div>
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

  const refLock = useRef(false);
  useEffect(() => {
    if (!ipns && !refLock.current) {
      refLock.current = true;
      setTimeout(() => {
        updateMint({
          ipns: "k51qzi5uqu5dktricedv5isy1c69oc6i7q15p7lzhkgyyarkdgz350emmvwnwa",
          uuid: "uuid",
        });
        setStep(1);
        refLock.current = false;
      }, 4000);
    } else if (ipns) {
      setStep((o) => (o === 0 ? 1 : o));
    }
  }, [ipns]);
  return (
    <div className=" px-10 pt-9 flex">
      <BucketImage size={currentEdition.capacityInGb} />
      {step === 0 && <CreateIpns />}
      {step === 1 && <TipIpns ipns={ipns} onContinue={mOnNext} />}
      {step === 2 && <SetStyle onContinue={mOnNext} />}
      {step === 3 && <PreMetadata onContinue={onNext} />}
    </div>
  );
});
