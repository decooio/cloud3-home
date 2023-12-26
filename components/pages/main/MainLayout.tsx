import { Button } from "@components/common/Button";
import { Icon } from "@components/common/Icon";
import { IconSetting } from "@components/common/icons";
import { Logo } from "@components/common/Logo";
import { ConnectWallet } from "@components/modals/ConnectWallet";
import { IS_DEV, IS_TEST } from "@lib/env";
import { useOn } from "@lib/hooks/tools";
import { useConnected } from "@lib/hooks/useConnected";
import { openExtUrl, shortStr } from "@lib/utils";
import classNames from "classnames";
import React, {
  HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BsBucket } from "react-icons/bs";
import { IoLockClosedOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useHoverDirty } from "react-use";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import {clearAuth} from "@lib/hooks/useGetAuth";
import algoWallet from "@lib/algorand/algoWallet";
interface Menu {
  id: number;
  icon: any;
  text: string;
  path?: string;
  url?: string;
}

const net_text =
  IS_DEV || IS_TEST
    ? "Claim your test version W3Bucket NFT and start your decentralized cloud storage experience on Crust Cloud testnet. To continue, please connect your Ethereum wallet and switch to Goerli testnet."
    : "W3Bucket runs on Ethereum mainnet. To start your decentralized cloud storage experience, please connect your Ethereum wallet.";

export const MainLayout = React.memo(
  (p: { menuId: number } & HTMLAttributes<HTMLDivElement>) => {
    const { menuId, children, ...props } = p;
    let { address:account } = useAccount();
    const { chain } = useNetwork();
    const isConnected = useConnected();
    const isAlgoConnected = algoWallet.isConnected();
    if (isAlgoConnected) {
      account = `0x${algoWallet.account}`;
    }
    const menus: Menu[] = useMemo(() => {
      return [
        { id: 1, icon: BsBucket, text: "W3Buckets", path: "/buckets" },
        { id: 2, icon: IconSetting, text: "Settings", path: "/settings" },
        {
          id: 3,
          icon: "cru-fo-homework",
          text: "Docs",
          url: "https://docs.crustcloud.io",
        },
      ];
    }, []);
    const push = useNavigate();
    const [showConnect, setShowConnect] = useState(false);
    useEffect(() => {
      isConnected && setShowConnect(false);
    }, [isConnected]);
    const { disconnect } = useDisconnect();
    const onDis = useOn(() => {
      disconnect();
      clearAuth();
      algoWallet.disconnect();
      push('/buckets');
    })
    const btnAccount = useRef(null);
    const isHoverAccount = useHoverDirty(btnAccount);
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
            <div className="my-8 flex items-center mx-auto">
              <Logo className="text-black-1" />
              {isConnected && (
                <div
                  className={classNames(
                    " ml-4 text-xs px-[0.39rem] py-[0.13rem] mb-[-0.42rem] text-white",
                    IS_DEV || IS_TEST ? "bg-gray-11" : "bg-blue-2"
                  )}
                >
                  {isAlgoConnected ? 'Algorand' : chain.name.replace(' ', '')}
                </div>
              )}
            </div>
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
            <Button
              ref={btnAccount}
              className={classNames("w-[12.8125rem] h-[3.375rem] text-lg self-end mx-auto mb-10", {
                " hidden": !isConnected,
              })}
              // disHover={true}
              onClick={onDis}
              text={isHoverAccount ? "Disconnect" : shortStr(isAlgoConnected ? account.slice(2) : account, 6, 6)}
            />
          </div>
          {isConnected ? (
            children
          ) : (
            <div className="flex-1 flex px-[15%] pt-[30vh] h-full flex-col items-center">
              <div className=" text-xl text-black text-center">{net_text}</div>
              <Button
                text="Connect Wallet"
                className="mt-8"
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
