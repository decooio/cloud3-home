import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { StoreProvider, useInitStore } from "@lib/store";
import Home from "./home/Home";
import Connect from "./connect/Connect";
function Root_() {
  const store = useInitStore();
  return (
      <StoreProvider value={store}>
        <div className="App" id="app-root">
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/connect" element={<Connect />} />
            </Routes>
          </HashRouter>
        </div>
      </StoreProvider>
  );
}
export default React.memo(Root_);
