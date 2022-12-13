import type { NextPage } from "next";
import { SectionBottom } from "./SectionBottom";
import { SectionMid } from "./SectionMid";
import { SectionTop } from "./SectionTop";
import { SectionProduct } from "./SectionProduct";
import { SectionWidget } from "./SectionWidget";

const Home: NextPage = () => {
  return (
    <div className="w-full">
      <SectionTop />
      <SectionProduct />
      <SectionWidget />
      <SectionBottom />
      <SectionMid />
    </div>
  );
};

export default Home;
