import { Button } from "@components/common/Button";
import { Icon } from "@components/common/Icon";
import { IconSetting } from "@components/common/icons";
import { Logo } from "@components/common/Logo";
import { ConnectWallet } from "@components/ConnectWallet";
import { useStore } from "@lib/store/store";
import { openExtUrl, shortStr } from "@lib/utils";
import { useAddress, useConnect } from "@thirdweb-dev/react";
import classNames from "classnames";
import React, { HTMLAttributes, useEffect, useMemo } from "react";
import { BsBucket } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
interface Menu {
  id: number;
  icon: any;
  text: string;
  path?: string;
  url?: string;
}
export const MainLayout = React.memo(
  (p: { menuId: number } & HTMLAttributes<HTMLDivElement>) => {
    const { menuId, children, ...props } = p;
    const account = useAddress();
    const menus: Menu[] = useMemo(() => {
      return [
        { id: 1, icon: BsBucket, text: "W3Buckets", path: "/buckets" },
        { id: 2, icon: IconSetting, text: "Settings", path: "/settings" },
        { id: 3, icon: "cru-fo-homework", text: "Docs", url: "docs" },
      ];
    }, []);
    const push = useNavigate();
    const connect = useConnect();
    const { oUpdate } = useStore();
    useEffect(() => {},[oUpdate, connect])
    return (
      <div
        {...props}
        className={classNames(
          props.className,
          " w-full h-screen min-h-max text-black-1"
        )}
      >
        {account && (
          <div className=" w-full flex h-full">
            <div className="h-full w-64 flex flex-col border-r-8 border-solid border-[#EEEEEE]">
              <Logo className="text-black-1 my-10 mx-auto" />
              <div className="flex-1">
                {menus.map((m, index) => (
                  <div
                    key={`menu_${index}`}
                    className={classNames(
                      " pl-10 py-4 text-lg cursor-pointer ",
                      {
                        "bg-black-1": m.id === menuId,
                        "text-white": m.id === menuId,
                      }
                    )}
                    onClick={() => {
                      if (m.path) {
                        push(m.path);
                      } else if (m.url) {
                        openExtUrl(m.url);
                      }
                    }}
                  >
                    <Icon
                      icon={m.icon}
                      className=" text-2xl inline-block align-middle"
                    />
                    <span className="ml-3 align-middle">{m.text}</span>
                  </div>
                ))}
              </div>
              <Button
                className=" self-end mx-auto mb-10"
                text={shortStr(account, 6, 6)}
              />
            </div>
            {children}
          </div>
        )}
        {!account && <ConnectWallet />}
      </div>
    );
  }
);
