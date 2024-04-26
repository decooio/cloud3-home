import dynamic from "next/dynamic";
import React from "react";

const MRoot = dynamic(() => import("@components/pages/Root"), { ssr: false, suspense: false });
const IndexPage = () => {
  console.info("IndexPage:", new Date().getTime());
  return <MRoot />;
};

export default React.memo(IndexPage);
