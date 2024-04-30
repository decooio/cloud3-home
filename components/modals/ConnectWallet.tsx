import { IconMetaMask, IconPera } from "@components/common/icons";
import algoWallet from "@lib/algorand/algoWallet";
import { useOn } from "@lib/hooks/tools";
import { useConnected } from "@lib/hooks/useConnected";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalHead } from "./Modal";

export const ConnectWallet = React.memo((p: { onClose: () => void }) => {
  const { onClose } = p;
  const connnected = useConnected();
  const cm = useConnectModal();
  const push = useNavigate();
  useEffect(() => {
    push("/buckets");
  }, [connnected]);
  const onConnect = useOn(async () => {
    try {
      cm.openConnectModal && cm.openConnectModal();
    } catch (error) {
      console.error(error);
    }
  });
  const onConnectMyAlgoWallet = useOn(async () => {
    try {
      await algoWallet.connect();
    } catch (err) {
      console.error(err);
    }
  });
  return (
    <Modal outClick={onClose}>
      <ModalHead title="Connect Wallet" onClose={onClose} />
      <div
        onClick={onConnect}
        className="bg-[#ececec] hover:bg-[#dfdfdf] h-14 mt-5 flex px-6 py-3 cursor-pointer justify-between items-center"
      >
        <IconMetaMask className="text-[1.75rem]"/>
        <div className=" text-black-1 text-sm">EVM Wallets</div>
        <div className=" w-[1.75rem]" />
      </div>
      <div
        onClick={onConnectMyAlgoWallet}
        className="bg-[#ececec] hover:bg-[#dfdfdf] h-14 mt-5 flex px-6 py-3 cursor-pointer justify-between items-center"
      >
        <IconPera className=" text-[1.75rem]" />
        <div className=" text-black-1 text-sm">PeraWallet</div>
        <div className=" w-[1.75rem]" />
      </div>
    </Modal>
  );
});
