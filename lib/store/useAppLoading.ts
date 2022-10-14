import { useCallback, useEffect, useMemo } from "react";
import { useStore } from "./store";
export interface UseAppLoading {
  show: () => void;
  hiden: () => void;
  loading: boolean;
}

export function useAppLoading(showLoading?: boolean) {
  const {
    oUpdate,
    store: { loading },
  } = useStore();
  const show = useCallback(() => oUpdate({ loading: true }), [oUpdate]);
  const hiden = useCallback(() => oUpdate({ loading: false }), [oUpdate]);
  useEffect(() => {
    if (typeof showLoading === "boolean") {
      if (showLoading) show();
      else hiden();
    }
  }, [showLoading]);
  return useMemo(() => ({ show, hiden, loading }), [show, hiden, loading]);
}
