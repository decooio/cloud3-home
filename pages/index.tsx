import dynamic from "next/dynamic";
// import Root from "../components/pages/Root";
const Root = dynamic(() => import("../components/pages/Root"), { ssr: false });
const IndexPage = () => {
    return <Root />;
};

export default IndexPage;
