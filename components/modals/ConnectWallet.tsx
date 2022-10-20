import { IconMetaMask } from "@components/common/icons";
import { IS_DEV, IS_TEST } from "@lib/env";
import { useOn } from "@lib/hooks/tools";
import { useMetamask, useNetwork } from "@thirdweb-dev/react";
import React from "react";
import { ConnectorData } from 'wagmi-core';
import { Modal, ModalHead } from "./Modal";

export const ConnectWallet = React.memo((p: { onClose: () => void }) => {
  const { onClose } = p;
  const connect = useMetamask();
  const [{ data }, switchChain] = useNetwork();
  const onConnect = useOn(async () => {
    console.info("data:", data);
    try {
      if (data && data.chain && data.chain.unsupported) {
        await switchChain(IS_DEV || IS_TEST ? 5 : 1);
      } else {
        const res: any = await connect();
        const con = res.data as ConnectorData
        if(con && con.chain && con.chain.unsupported){
          setTimeout(onConnect, 200)
        }
      }
    } catch (error) {
      console.error(error)
    }
   
  });
  return (
    <Modal outClick={onClose}>
      <ModalHead title="Connect Wallet" onClose={onClose} />
      <div
        onClick={onConnect}
        className="bg-[#ececec] hover:bg-[#dfdfdf] mt-5 flex px-6 py-3 cursor-pointer justify-between items-center"
      >
        <IconMetaMask className=" text-[3.75rem]" />
        <div className=" text-black-1 text-sm">MetaMask</div>
        <div className=" w-[3.75rem]" />
      </div>
    </Modal>
  );
});
