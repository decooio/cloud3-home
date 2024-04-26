import { AppLoading } from "@components/common/AppLoading";
import { Toasts } from "@components/common/Toast";
import { StoreProvider, useInitStore } from "@lib/store/store";
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import Home from "./home/Home";
import { Bucket } from "./main/Bucket";
import { Buckets } from "./main/Buckets";
import { Mint } from "./main/Mint";
import { Setting } from "./main/Setting";
import { Providers } from "./Providers";
import { Admin } from "./main/Admin";

function WrapStoreProvider({ children }: { children: React.ReactNode }) {
  const store = useInitStore();
  return <StoreProvider value={store}>{children}</StoreProvider>;
}

export default React.memo(() => {
  console.info("Root:", new Date().getTime());
  return (
    <Providers>
      <WrapStoreProvider>
        <div className="App relative" id="app-root">
          <ReactTooltip
            effect="solid"
            clickable={true}
            delayHide={200}
            isCapture={true}
            overridePosition={({ top, left }, currentEvent, currentTarget, node) => {
              node.style.maxWidth = "300px"; // Your custom width
              node.style.wordBreak = "break-all"; // Your custom width
              return {
                top,
                left,
              };
            }}
          />
          <div className="App overflow-y-auto">
            <HashRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/buckets" element={<Buckets />} />
                <Route path="/bucket/:bucketId/:ipnsId" element={<Bucket />} />
                <Route path="/settings" element={<Setting />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </HashRouter>
          </div>

          <AppLoading />
          <Toasts />
        </div>
      </WrapStoreProvider>
    </Providers>
  );
});
