import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { StoreProvider, useInitStore } from "@lib/store/store";
import Home from "./home/Home";
import { Buckets } from "./main/Buckets";
import Connect from "./connect/Connect";
import { Bucket } from "./main/Bucket";
import { Setting } from "./main/Setting";
import { Mint } from "./main/Mint";
import { AppLoading } from "@components/common/AppLoading";
function Root_() {
  const store = useInitStore();
  return (
    <StoreProvider value={store}>
      <div className="App relative" id="app-root">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/buckets" element={<Buckets />} />
            <Route path="/bucket/:bucketId" element={<Bucket />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/mint" element={<Mint />} />
          </Routes>
        </HashRouter>
        <AppLoading/>
      </div>
    </StoreProvider>
  );
}
export default React.memo(Root_);
