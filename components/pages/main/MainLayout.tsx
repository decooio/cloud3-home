import { Button } from "@components/common/Button";
import { Icon } from "@components/common/Icon";
import { Logo } from "@components/common/Logo";
import { IconSetting } from "@components/common/icons";
import { ConnectWallet } from "@components/modals/ConnectWallet";
import algoWallet from "@lib/algorand/algoWallet";
import { ChainIcon, SupportChain } from "@lib/config";
import { IS_DEV, IS_TEST } from "@lib/env";
import { useOn } from "@lib/hooks/tools";
import { useConnected } from "@lib/hooks/useConnected";
import { clearAuth } from "@lib/hooks/useGetAuth";
import { useW3BucketAbi } from "@lib/hooks/useW3BucketAbi";
import { openExtUrl, shortStr } from "@lib/utils";
import { ConnectButton, useChainModal } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import React, { HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { BsBucket } from "react-icons/bs";
import { IoLockClosedOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAsync, useHoverDirty } from "react-use";
import { useAccount, useDisconnect, usePublicClient } from "wagmi";
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

function useShowAdmin() {
  const { chain, address } = useAccount();
  const w3b = useW3BucketAbi();
  const { value, loading } = useAsync(async () => {
    if (!chain || !address || !w3b) return false;
    return await w3b.hasRole(w3b.EDITIONS_ADMIN_ROLE, address);
  }, [chain?.id, address, w3b]);
  return value && !loading;
}
export const MainLayout = React.memo((p: { menuId: number; tit?: React.ReactNode } & HTMLAttributes<HTMLDivElement>) => {
  const { menuId, children, tit, ...props } = p;
  let { address: account, chain } = useAccount();
  const chainError = SupportChain.find((item) => item.id == chain?.id) ? false : true;

  const isConnected = useConnected();
  const isAlgoConnected = algoWallet.isConnected();
  if (isAlgoConnected) {
    account = `0x${algoWallet.account}`;
  }
  const showAdmin = useShowAdmin();
  const menus: Menu[] = useMemo(() => {
    const res: Menu[] = [
      { id: 1, icon: BsBucket, text: "W3Buckets", path: "/buckets" },
      { id: 2, icon: IconSetting, text: "Settings", path: "/settings" },
      {
        id: 3,
        icon: "cru-fo-homework",
        text: "Docs",
        url: "https://docs.crustcloud.io",
      },
    ];
    if (showAdmin) {
      res.push({ id: 4, icon: IconSetting, text: "Admin", path: "/admin" });
    }
    return res;
  }, [showAdmin]);
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
    push("/buckets");
  });
  const btnAccount = useRef(null);
  const isHoverAccount = useHoverDirty(btnAccount);

  const { openChainModal, chainModalOpen } = useChainModal();
  console.info("open:", chainModalOpen);
  return (
    <div {...props} className={classNames(props.className, " w-full h-screen min-h-max text-black-1")}>
      <div className=" w-full flex h-full overflow-hidden">
        <div className="h-full w-64 shrink-0 flex flex-col border-r-8 border-solid border-[#EEEEEE]">
          <div className="my-8 flex items-center mx-auto">
            <Logo className="text-black-1" />
          </div>
          <div className="flex-1">
            {menus.map((m, index) => (
              <div
                key={`menu_${index}`}
                className={classNames(" pl-8 py-4 text-lg cursor-pointer whitespace-nowrap", {
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
                <Icon icon={isConnected ? m.icon : IoLockClosedOutline} className=" text-2xl inline-block align-middle" />
                <span className="ml-3 align-middle">{m.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex h-full flex-col w-[calc(100%-256px)]">
          {isConnected && (
            <div className="flex w-full justify-end items-center gap-5 px-8 py-4 border-b border-bottom border-b-gray-700">
              {tit}
              <div
                onClick={() => {
                  !isAlgoConnected && openChainModal && openChainModal();
                }}
                className={classNames(
                  "cursor-pointer text-xs px-3 h-11 text-black flex items-center gap-2 border border-black-1",
                  !isAlgoConnected && chainError ? "bg-red-500" : IS_DEV || IS_TEST ? "bg-gray-11" : ""
                )}
              >
                {chain && ChainIcon[chain.id] && <img src={ChainIcon[chain.id]} className="w-6 h-6" />}
                {isAlgoConnected ? "Algorand" : chainError ? "Wrong network" : chain.name.replace(" ", "")}
              </div>
              <Button
                ref={btnAccount}
                className={classNames("w-[12.8125rem] h-11 text-lg", {
                  " hidden": !isConnected,
                })}
                // disHover={true}
                onClick={onDis}
                text={isHoverAccount ? "Disconnect" : shortStr(isAlgoConnected ? account.slice(2) : account, 6, 6)}
              />
            </div>
          )}
          {isConnected ? (
            children
          ) : (
            <div className="flex-1 w-full flex px-[15%] pt-[30vh] h-full flex-col items-center">
              <div className=" text-xl text-black text-center">{net_text}</div>
              <Button text="Connect Wallet" className="mt-8" onClick={() => setShowConnect(true)} />
            </div>
          )}
        </div>
        {showConnect && <ConnectWallet onClose={() => setShowConnect(false)} />}
      </div>
    </div>
  );
});
