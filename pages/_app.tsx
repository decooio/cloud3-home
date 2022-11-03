import "@decooio/crust-fonts/style.css";
import { SupportChain } from "@lib/config";
import type { AppProps } from "next/app";
import Head from "next/head";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import { Squada_One, Work_Sans, Roboto } from "@next/font/google";
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
const fontvarClass = [so, ws, rb].map((item) => item.variable).join(" ");
import "../styles/global.css";
import classNames from "classnames";

const connector = new MetaMaskConnector();
const { provider, webSocketProvider } = configureChains(SupportChain, [
  publicProvider(),
]);
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [connector],
});

export default function App({ Component, pageProps }: AppProps) {
  // useGaPageView();

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
        <title>{"Cloud3.cc"}</title>
      </Head>
      <WagmiConfig client={client}>
        {typeof window === "undefined" ? null : <Component {...pageProps} />}
      </WagmiConfig>
    </div>
  );
}
