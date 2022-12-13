import React from "react";
import ContainerSvg from "public/images/container.svg";
import NFTSvg from "public/images/nft.svg";
import {Button} from "@components/common/Button";
export const SectionBottom = React.memo(() => {
    return (
        <div className="w-full py-6 px-12 flex justify-center pb-20 text-lg mt-3 text-slate-700 text-lg">
            <div className="w-container flex flex-col">
                <h3 className="text-black text-40px my-14 font-medium">Web3 Storage Buckets & Web3 IPFS Gateways</h3>
                <p className="pb-20">
                    Cloud3 defines what cloud storage middlewares should look like in Web3 - every storage bucket is a NFT, and every IPFS gateway is a NFT.
                </p>
                <div className="flex justify-center">
                    <div>
                        <div className="flex items-center">
                            <ContainerSvg />
                            <span className="text-6xl">=</span>
                            <NFTSvg />
                        </div>
                        <div className="flex items-center pt-24">
                            <ContainerSvg />
                            <span className="text-6xl">=</span>
                            <NFTSvg />
                        </div>
                    </div>

                    <div className="ml-16">
                        <h4 className="text-2xl font-medium text-black mb-4">Store files in W3Buckets: Decentralized, Guaranteed & Alive.</h4>
                        <p>
                            All contents in the W3Buckets are immutable, decentralized stored,  guaranteed with up to permanent persistence in the open internet, and most importantly, owned & controlled by the NFT owner.
                        </p>
                        <h4 className="text-2xl font-medium text-black mb-4 mt-24">Guaranteed Storage</h4>
                        <p>
                            Storage service are called by Standard IPFS Remote Pinning Service APIs that make your files always available (alive!) on IPFS with multiple replicas and accessible from everywhere.
                        </p>
                        <div className="flex mt-8">
                            <Button text="Play Demo" />
                            <Button className="ml-5" text="Show Code" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});
