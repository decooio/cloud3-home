import { Web3Provider } from "@ethersproject/providers";

import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
export function useWeb3Provider(): Web3Provider | undefined {
  const {
    connectors: [connector],
  } = useConnect();
  const [provider, setProvider] = useState<Web3Provider | undefined>();
  useEffect(() => {
    if (connector) {
      // const provider = connector.getProvider();
      connector
        .getProvider()
        .then((provider) => setProvider(new Web3Provider(provider)));
    }
  }, [connector]);

  return provider;
}
