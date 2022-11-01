import { IconMetaMask } from "@components/common/icons";
import { SupportChain } from "@lib/config";
import { useOn } from "@lib/hooks/tools";
import React from "react";
import { useConnect, useSwitchNetwork } from "wagmi";
import { Modal, ModalHead } from "./Modal";

export const ConnectWallet = React.memo((p: { onClose: () => void }) => {
  const { onClose } = p;
  const { connectAsync, connectors, data } = useConnect();
  const { switchNetworkAsync } = useSwitchNetwork();
  const onConnect = useOn(async () => {
    try {
      console.info("data:", data);
      console.info("cts:", connectors);
      if ((!data || data.chain.unsupported) && switchNetworkAsync) {
        await switchNetworkAsync(SupportChain[0].id);
      } else {
        await connectAsync({
          chainId: SupportChain[0].id,
          connector: connectors[0],
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
  return (
    <Modal outClick={onClose}>
      <ModalHead title="Connect Wallet" onClose={onClose} />
      <div
        onClick={onConnect}
        className="bg-[#ececec] hover:bg-[#dfdfdf] h-14 mt-5 flex px-6 py-3 cursor-pointer justify-between items-center"
      >
        <IconMetaMask className=" text-[1.75rem]" />
        <div className=" text-black-1 text-sm">MetaMask</div>
        <div className=" w-[1.75rem]" />
      </div>
    </Modal>
  );
});
