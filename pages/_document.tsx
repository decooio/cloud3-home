import Document, { Html, Head, Main, NextScript } from "next/document";
import { GA_ID } from "@lib/config";
export default class MyDocument extends Document {

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="One-Stop Land Platform For The Metaverse"
          />
          {/* <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${GA_ID}', {  page_path: window.location.pathname });
                    `,
            }}
          /> */}
          {/* <script src="https://platform.twitter.com/widgets.js"/> */}
          <link rel="icon" type="image/png" href="/fav.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
