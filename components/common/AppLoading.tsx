import { useAppLoading } from "@lib/store/useAppLoading";
import React, { useCallback } from "react";
import { Logo } from "./Logo";
export const AppLoading = React.memo(() => {
  const intercepEvent = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);
  const { loading } = useAppLoading()
  if(!loading) return null
  return (
    <div
      className=" fixed left-0 top-0 w-screen h-screen flex justify-center items-center bg-opacity-60 bg-black-1"
      onMouseMove={intercepEvent}
      onMouseDown={intercepEvent}
      onClick={intercepEvent}
    >
      <Logo className=" animate-bounce_1 py-10" />
    </div>
  );
});
