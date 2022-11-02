import { AppLoading } from "@components/common/AppLoading";
import { StoreProvider, useInitStore } from "@lib/store/store";
import React, {useEffect} from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import { Bucket } from "./main/Bucket";
import { Buckets } from "./main/Buckets";
import { Mint } from "./main/Mint";
import { Setting } from "./main/Setting";
import ReactTooltip from "react-tooltip";
function Root_() {
  const store = useInitStore();
  return (
    <StoreProvider value={store}>
      <div className="App relative" id="app-root">
        <ReactTooltip
            effect="solid"
            clickable={true}
            delayHide={200}
            isCapture={true}
            overridePosition={(
                { top, left },
                currentEvent,
                currentTarget,
                node
            ) => {
              node.style.maxWidth = '450px'; // Your custom width
              return {
                top,
                left
              };
            }}
        />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buckets" element={<Buckets />} />
            <Route path="/bucket/:bucketId/:ipnsId" element={<Bucket />} />
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
