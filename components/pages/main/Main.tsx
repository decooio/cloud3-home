import { Button } from "@components/common/Button";
import { Icon } from "@components/common/Icon";
import { Logo } from "@components/common/Logo";
import { ConnectWallet } from "@components/ConnectWallet";
import { openExtUrl, shortStr } from "@lib/utils";
import { useAddress } from "@thirdweb-dev/react";
import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BsBucket } from "react-icons/bs";
interface Menu {
  icon: any;
  text: string;
  path?: string;
  url?: string;
}
export const Main = React.memo(() => {
  const account = useAddress();
  const menus: Menu[] = useMemo(() => {
    return [
      { icon: BsBucket, text: "W3Buckets", path: "main" },
      { icon: BsBucket, text: "Settings", path: "main" },
      { icon: BsBucket, text: "Docs", path: "main" },
    ];
  }, []);
  const buckets = useMemo(() => [], []);
  const onNewBucket = useCallback(() => {}, []);
  const push = useNavigate();
  return (
    <div className=" w-full h-screen min-h-max text-black-1">
      {account && (
        <div className=" w-full flex h-full">
          <div className="h-full w-64 flex flex-col border-r-8 border-solid border-[#EEEEEE]">
            <Logo className="text-black-1 my-10 mx-auto" />
            <div className="flex-1">
              {menus.map((m, index) => (
                <div
                  key={`menu_${index}`}
                  className=" pl-10 py-4 text-lg cursor-pointer"
                  onClick={() => {
                    if (m.path) {
                      push(m.path);
                    } else if (m.url) {
                      openExtUrl(m.url);
                    }
                  }}
                >
                  <Icon icon={m.icon} className=" text-2xl inline-block" />
                  <span className="ml-3 align-middle">{m.text}</span>
                </div>
              ))}
            </div>
            <Button
              className=" self-end mx-auto mb-10"
              text={shortStr(account, 6, 6)}
            />
          </div>
          <div className="flex-1 h-full px-8 pt-10 flex flex-col">
            <div className="w-full flex justify-between mb-5 pb-5 border-b-1 border-solid border-black-1">
              <span className=" text-2xl font-medium">
                Your W3Buckets({buckets.length})
              </span>
              <Button
                className=" self-end mx-auto mb-10"
                text="Mint a New W3Bucket"
                onClick={onNewBucket}
              />
            </div>
            <div className="flex1 w-full"></div>
          </div>
        </div>
      )}
      {!account && <ConnectWallet />}
    </div>
  );
});
