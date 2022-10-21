import { Button } from "@components/common/Button";
import { Icon } from "@components/common/Icon";
import { IconSetting } from "@components/common/icons";
import { Logo } from "@components/common/Logo";
import { ConnectWallet } from "@components/modals/ConnectWallet";
import { IS_DEV, IS_TEST } from "@lib/env";
import { openExtUrl, shortStr } from "@lib/utils";
import { useAddress, useChainId } from "@thirdweb-dev/react";
import classNames from "classnames";
import React, { HTMLAttributes, useEffect, useMemo, useState } from "react";
import { BsBucket } from "react-icons/bs";
import { IoLockClosedOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
interface Menu {
  id: number;
  icon: any;
  text: string;
  path?: string;
  url?: string;
}

const net_text =
  IS_DEV || IS_TEST
    ? "Claim your test version W3Bucket NFT and start your decentralized cloud storage experience on Cloud3 testnet. To continue, please connect your Ethereum wallet and switch to Goerli testnet."
    : "W3Bucket runs on Ethereum mainnet. To start your decentralized cloud storage experience, please connect your Ethereum wallet.";

export const MainLayout = React.memo(
  (p: { menuId: number } & HTMLAttributes<HTMLDivElement>) => {
    const { menuId, children, ...props } = p;
    const account = useAddress();
    const chainId = useChainId();
    const isConnected = useMemo(() => {
      if (IS_DEV || IS_TEST) return account && chainId === 5;
      return account && chainId === 1;
    }, [account, chainId]);
    const menus: Menu[] = useMemo(() => {
      return [
        { id: 1, icon: BsBucket, text: "W3Buckets", path: "/buckets" },
        { id: 2, icon: IconSetting, text: "Settings", path: "/settings" },
        { id: 3, icon: "cru-fo-homework", text: "Docs", url: "docs" },
      ];
    }, []);
    const push = useNavigate();
    const [showConnect, setShowConnect] = useState(false);
    useEffect(() => {
      isConnected && setShowConnect(false);
    }, [isConnected]);
    return (
      <div
        {...props}
        className={classNames(
          props.className,
          " w-full h-screen min-h-max text-black-1"
        )}
      >
        <div className=" w-full flex h-full">
          <div className="h-full w-64 flex flex-col border-r-8 border-solid border-[#EEEEEE]">
            <Logo className="text-black-1 my-10 mx-auto" />
            <div className="flex-1">
              {menus.map((m, index) => (
                <div
                  key={`menu_${index}`}
                  className={classNames(" pl-10 py-4 text-lg cursor-pointer ", {
                    "bg-black-1": m.id === menuId,
                    "text-white": m.id === menuId,
                    "!text-gray-7 !bg-transparent": !isConnected,
                  })}
                  onClick={() => {
                    if (!isConnected) return;
                    if (m.path) {
                      push(m.path);
                    } else if (m.url) {
                      openExtUrl(m.url);
                    }
                  }}
                >
                  <Icon
                    icon={isConnected ? m.icon : IoLockClosedOutline}
                    className=" text-2xl inline-block align-middle"
                  />
                  <span className="ml-3 align-middle">{m.text}</span>
                </div>
              ))}
            </div>
            {isConnected && (
              <Button
                className=" self-end mx-auto mb-10"
                text={shortStr(account, 6, 6)}
              />
            )}
          </div>
          {isConnected ? (
            children
          ) : (
            <div className="flex-1 flex px-[15%] pt-[30vh] h-full flex-col items-center">
              <div className=" text-xl text-black">{net_text}</div>
              <Button
                text="Connect Wallet"
                className=" mt-8"
                onClick={() => setShowConnect(true)}
              />
            </div>
          )}
          {showConnect && (
            <ConnectWallet onClose={() => setShowConnect(false)} />
          )}
        </div>
      </div>
    );
  }
);
