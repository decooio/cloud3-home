import React from "react";
import HomeImg1Svg from "../../../public/images/home_img1.svg";
export const SectionBottom = React.memo(() => {
    return (
        <div className="w-full py-6 px-12 pb-20 flex justify-center items-center text-lg mt-3 text-slate-700 text-lg bg-[#F5F5F5]">
            <div className="w-[32.25rem]">
                <h3 className="text-black text-4xl my-14 font-medium">W3Bucket NFT</h3>
                <p>
                    We define what cloud storage should look like in Web3 - Every storage bucket is a NFT.
                </p>
                <p className="mt-10">
                    All contents in the W3Buckets are immutable, decentralized stored,  guaranteed of permanent persistence in the open internet, and most importantly, owned & controlled by the NFT owner.
                </p>
                <h4 className="text-xl my-5 mt-16 font-medium text-black">Guaranteed Storage</h4>
                <p>
                    Guaranteed with permanent, multi-replica persistence for your files with IPFS Cloud3, powered by Crust Network - the native incentive layer of IPFS.
                </p>
                <h4 className="text-xl my-5 mt-16 font-medium text-black">Toolkits & Support</h4>
                <p>
                    All you need for achieving truly decentralized storage in various scenarios is here: GitHub Pin Flow, IPFS retrieval solutions, and W3Editor.
                </p>
            </div>
            <div className="w-[32.25rem] ml-32 mt-32">
                <HomeImg1Svg />
                <h4 className="text-xl my-5 mt-24 text-black font-medium">IPFS Remote Pin</h4>
                <p className="w-[28.8rem]">
                    Called by Standard IPFS Remote Pinning Service API that makes your files always available (alive!) on IPFS.
                </p>
                <h4 className="text-xl my-5 mt-20 text-black font-medium">Verifiable on IPFS</h4>
                <p className="w-[30rem]">
                    Are your contents really decentralized stored and accessible across the world? Try this simple site IPFS Scan to verify.
                </p>
            </div>
        </div>
    )
});
