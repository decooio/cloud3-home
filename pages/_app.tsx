import "@decooio/crust-fonts/style.css";
import { SupportChain } from "@lib/config";
import type { AppProps } from "next/app";
import Head from "next/head";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import { Squada_One, Work_Sans, Roboto, Roboto_Mono } from "@next/font/google";
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
})
const fontvarClass = [so, ws, rb, rbm].map((item) => item.variable).join(" ");
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
        <script src="../lib/twitter.js" type="text/javascript">
          {/* !function(e,t,n,s,u,a){e.twq || (s = e.twq = function () {
            s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
          }, s.version = '1.1', s.queue = [], u = t.createElement(n), u.async = !0, u.src = 'https://static.ads-twitter.com/uwt.js',
            a = t.getElementsByTagName(n)[0], a.parentNode.insertBefore(u, a))}(window,document,'script');
          twq('config','oh0rh'); */}
        </script>
        <title>{"Crust Cloud"}</title>
      </Head>
      <WagmiConfig client={client}>
        {typeof window === "undefined" ? null : <Component {...pageProps} />}
      </WagmiConfig>
    </div>
  );
}
