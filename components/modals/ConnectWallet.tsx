import { IconMetaMask, IconPera } from "@components/common/icons";
import { SupportChain, SupportId2Chain } from "@lib/config";
import { useOn } from "@lib/hooks/tools";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useConnect, useSwitchNetwork } from "wagmi";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { Modal, ModalHead } from "./Modal";
import algoWallet from '@lib/algorand/algoWallet';

export const ConnectWallet = React.memo((p: { onClose: () => void }) => {
  const { onClose } = p;
  const { connectAsync, connectors, data } = useConnect();
  const { switchNetworkAsync } = useSwitchNetwork();
  const push = useNavigate()
  const onConnect = useOn(async () => {
    try {
      const chainId = await (async () => {
        const provider: any = await detectEthereumProvider();
        if (provider && provider.isMetaMask) {
          await provider.request({ method: "eth_requestAccounts" });
          const web3Provider = new ethers.providers.Web3Provider(provider);
          const signer = web3Provider.getSigner();
          const id = await signer.getChainId();
          if (SupportId2Chain.has(id)) return id;
        }
        console.warn(`Cannot get chainId from provider or unsupported chain, use ${SupportChain[0].id}`);
        return SupportChain[0].id;
      })();
      const connector = new MetaMaskConnector({
        chains: [SupportId2Chain.get(chainId)]
      })
      console.info("data:", data);
      console.info("cts:", connectors);
      if ((!data || data.chain.unsupported) && switchNetworkAsync) {
        await switchNetworkAsync(chainId);
      } else {
        await connectAsync({
          chainId: chainId,
          connector: connector,
        });
      }
      push('/buckets')
    } catch (error) {
      console.error(error);
    }
  });
  const onConnectMyAlgoWallet = useOn(async () => {
    try {
      await algoWallet.connect();
      push('/buckets')
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
        <IconMetaMask className=" text-[1.75rem]" />
        <div className=" text-black-1 text-sm">MetaMask</div>
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
