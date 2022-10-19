import React from "react";
import {NextPage} from "next";
import {Button} from "@components/common/Button";

const Connect: NextPage = () => {
    return(
        <div className="w-full h-screen flex flex-col">
            <div className="bg-black h-14 w-full flex items-center font-WorkSans">
                <div className="font-SquadaOne text-4xl px-12">IPFS Cloud</div>
            </div>
            <div className="w-full flex flex-col flex-1 justify-center items-center text-black text-xl">
                <span className="w-[47rem] text-center font-normal">
                    Claim your test version W3Bucket NFT on Goerli testnet and start your decentralized storage experience.
                </span>
                <span className="w-[47rem] text-center font-normal">
                    To continue, please connect your MetaMask and switch to Goerli testnet.
                </span>
                <Button
                    className="h-26 w-72 mt-12 border-black-1 border-solid border border-b-8 text-2xl"
                    text="MetaMask"
                    iconClassName="mr-5"
                    icon="images/metamask.svg"
                />
            </div>
        </div>
    )
}
export default Connect