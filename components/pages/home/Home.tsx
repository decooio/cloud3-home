import type { NextPage } from "next";
import { SectionBottom } from "./SectionBottom";
import { SectionMid } from "./SectionMid";
import { SectionTop } from "./SectionTop";

const Home: NextPage = () => {
  return (
    <div className="w-full">
      <SectionTop />
      <SectionMid />
      <SectionBottom />
    </div>
  );
};

export default Home;
