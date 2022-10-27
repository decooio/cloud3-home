import { MintData } from './../type.d';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { useSafeSet } from "../hooks/tools";
import { AuthIpfsEndpoint } from '@lib/config';

export interface Store {
  loading: boolean
  mintData?: MintData
  currentGateway?: AuthIpfsEndpoint
}

const defStore: Store = {
  loading: false,
}

export interface WrapStore {
  update: Dispatch<SetStateAction<Partial<Store>>>;
  oUpdate: Dispatch<SetStateAction<Partial<Store>>>;
  store: Store;
}


const StoreContext = React.createContext<WrapStore>({
  update: () => {},
  oUpdate: () => {},
  store: defStore,
});

export const StoreProvider = StoreContext.Provider;

const logStore = (action: any, old: any, n: any) => {
  // if (IS_DEV || IS_LOCAL) console.info("Store:", action,'\n', old, '\n', n);
};
export const useInitStore = (): WrapStore => {
  const [store, setStore] = useState<Store>(defStore);
  const update = useCallback((action: SetStateAction<Partial<Store>>) => {
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
  return useMemo(() => ({ store, update: safeUpdate, oUpdate: update }), [store, update, safeUpdate])
};
