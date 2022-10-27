import { AuthIpfsEndpoint, GatewayList } from "@lib/config";
import { useOn } from "@lib/hooks/tools";
import { useMemo } from "react";
import { useStore } from "./../store/store";

export interface UseGateway {
  list: AuthIpfsEndpoint[];
  setCurrent: (item: AuthIpfsEndpoint) => void;
  current: AuthIpfsEndpoint;
}

function getCurrent() {
  const lastValue = localStorage.getItem("last_gateway");
  const last = GatewayList.find((item) => item.value === lastValue);
  console.info("last-:", last);
  if (last) return last;
  return GatewayList[0];
}
export function useGateway(): UseGateway {
  const {
    store: { currentGateway },
    oUpdate,
  } = useStore();
  const current = useMemo(() => {
    if (!currentGateway) return getCurrent();
    return currentGateway;
  }, [currentGateway]);
  const setCurrent = useOn((item: AuthIpfsEndpoint) => {
    oUpdate({ currentGateway: item });
    localStorage.setItem('last_gateway', item.value)
  });
  return { list: GatewayList, setCurrent, current };
}
