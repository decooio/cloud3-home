import { useMetamask } from "@thirdweb-dev/react";
import React from "react";
import { Logo } from "./common/Logo";

export const ConnectWallet = React.memo(() => {
   const connect = useMetamask()
  return (
    <div className="w-screen h-screen min-h-max fixed left-0 top-0">
      <div className=" bg-black-1 px-12 py-3 w-full">
        <Logo/>
      </div>
      <div className=" w-full flex flex-col text-black">
            <button onClick={connect}>
                MetaMask
            </button>
      </div>
    </div>
  );
});
