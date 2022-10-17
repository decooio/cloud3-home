import { Web3Provider } from "@ethersproject/providers";
import { useConnect } from "@thirdweb-dev/react";
import { useMemo } from "react";
export function useWeb3Provider(): Web3Provider | undefined {
  const [{ data }] = useConnect();
  const connector = data && data.connector;
  return useMemo(() => {
    if (connector) {
      const provider = connector.getProvider(true);
      return new Web3Provider(provider);
    }
    return undefined;
  }, [connector]);
}
