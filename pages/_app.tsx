import "@decooio/crust-fonts/style.css";
import { SupportChain } from "@lib/config";
import { IS_DEV, IS_TEST } from "@lib/env";
import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import "../styles/global.css";
const hostOne = IS_TEST ? "test." : IS_DEV ? "beta." : "";

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
    <div suppressHydrationWarning className="App">
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
