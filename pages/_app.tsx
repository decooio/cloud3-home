import "@decooio/crust-fonts/style.css";
import { IS_DEV, IS_TEST } from "@lib/env";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.css";
const hostOne = IS_TEST ? "test." : IS_DEV ? "beta." : "";

export default function App({ Component, pageProps }: AppProps) {
  // useGaPageView();

  return (
    <div suppressHydrationWarning className="App">
      <ThirdwebProvider
        supportedChains={
          IS_TEST || IS_DEV ? [ChainId.Goerli] : [ChainId.Mainnet]
        }
        walletConnectors={["metamask"]}
        dAppMeta={{ name: "Cloud3.cc" }}
        autoConnect={true}
        desiredChainId={IS_TEST || IS_DEV ? ChainId.Goerli : ChainId.Mainnet}
      >
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
        {typeof window === "undefined" ? null : <Component {...pageProps} />}
      </ThirdwebProvider>
    </div>
  );
}
