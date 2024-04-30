import { SupportChain } from "@lib/config";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { WagmiProvider } from "wagmi";
const queryClient = new QueryClient();

export const Providers = React.memo(({ children }: { children: React.ReactNode }) => {
  const config = useMemo(() => {
    return getDefaultConfig({
      appName: "Cloud3 Bucket",
      projectId: "c8297bf5a93727c3d57da52d4e86da8b",
      chains: SupportChain as any,
      ssr: false, // If your dApp uses server side rendering (SSR)
    });
  }, []);
  
  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
});
