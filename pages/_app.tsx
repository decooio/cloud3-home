import "@decooio/crust-fonts/style.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { Squada_One, Work_Sans, Roboto, Roboto_Mono } from "@next/font/google";
import { Helmet } from "react-helmet";
const so = Squada_One({
  weight: "400",
  display: "auto",
  preload: true,
  variable: "--squada-one",
});
const ws = Work_Sans({
  weight: ["300", "400", "500", "600", "700"],
  display: "auto",
  preload: true,
  variable: "--work-sans",
});
const rb = Roboto({
  weight: "400",
  display: "auto",
  preload: true,
  variable: "--roboto",
});
const rbm = Roboto_Mono({
  weight: ["700"],
  display: "auto",
  preload: true,
  variable: "--roboto-mono",
});
const fontvarClass = [so, ws, rb, rbm].map((item) => item.variable).join(" ");
import "../styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";
import classNames from "classnames";

export default function App({ Component, pageProps }: AppProps) {
  // useGaPageView();
  console.info("_App:", new Date().getTime());
  return (
    <div suppressHydrationWarning className={classNames("App font-WorkSans", fontvarClass)}>
      <Head>
        <meta name="viewport" content="width=device-width,user-scalable=no" />
        {/* <meta name="twitter:card" content="summary_large_image" />
          <meta content="website" property="og:type" />
          <meta content="OneLand" property="og:site_name" />
          <meta
            content={`Providing in-depth metaverse data, a land-NFT marketplace and decentralised land financing.`}
            property="og:title"
          />
          <meta
            content={`https://${hostOne}oneland.world/images/twitter_card.png`}
            property="og:image"
          /> */}
        {/* <meta
          content={`OneLand provides in-depth market & metaverse project data, a land-NFT marketplace and decentralised land financing.`}
          property="og:description"
        /> */}
        <Helmet>
          <script src="../lib/twitter.js" type="text/javascript" />
        </Helmet>
        <title>{"Crust Cloud"}</title>
      </Head>
      {typeof window === "undefined" ? null : <Component {...pageProps} />}
    </div>
  );
}
