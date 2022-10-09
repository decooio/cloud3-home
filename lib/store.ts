import { IS_DEV, IS_LOCAL } from "./env";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { useSafeSet } from "./hooks/tools";

export interface Store {
  [k: string]: any;
}

export interface WrapStore {
  update: Dispatch<SetStateAction<Store>>;
  oUpdate: Dispatch<SetStateAction<Store>>;
  store: Store;
}

const StoreContext = React.createContext<WrapStore>({
  update: () => {},
  oUpdate: () => {},
  store: {},
});

export const StoreProvider = StoreContext.Provider;

const logStore = (action: any, old: any, n: any) => {
  // if (IS_DEV || IS_LOCAL) console.info("Store:", action,'\n', old, '\n', n);
};
export const useInitStore = (): WrapStore => {
  const [store, setStore] = useState<Store>({
    theme: localStorage.getItem("user-theme") || "light",
  });
  const update = useCallback((action: SetStateAction<Store>) => {
    if (typeof action === "function") {
      setStore((old) => {
        const n = action(old);
        const ns = { ...old, ...n };
        logStore(n, old, ns);
        return ns;
      });
    } else {
      setStore((old) => {
        const ns = { ...old, ...action };
        logStore(action, old, ns);
        return ns;
      });
    }
  }, []);
  return { store, update, oUpdate: update };
};

export const useStore = (): WrapStore => {
  const { store, update } = useContext(StoreContext);
  const [safeUpdate] = useSafeSet(update);
  return { store, update: safeUpdate, oUpdate: update };
};
