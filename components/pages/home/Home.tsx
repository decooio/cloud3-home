import type { NextPage } from "next";
import { SectionNft } from "./SectionNft";
import { SectionCases } from "./SectionCases";
import { SectionTop } from "./SectionTop";
import { SectionProduct } from "./SectionProduct";
import { SectionWidget } from "./SectionWidget";

const Home: NextPage = () => {
  return (
    <div className="w-full">
      <SectionTop />
      <SectionProduct />
      <SectionWidget />
      <SectionNft />
      <SectionCases />
    </div>
  );
};

export default Home;
