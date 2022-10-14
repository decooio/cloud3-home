import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";

export const useSafe = () => {
  const ref = useRef({ safe: true });
  useEffect(() => {
    ref.current.safe = true;
    return () => {
      ref.current.safe = false;
    };
  }, []);
  return ref.current;
};

export function useSafeSet<T>(...set: Dispatch<SetStateAction<T>>[]) {
  const safeObj = useSafe();
  return useMemo(
    () =>
      set.map<Dispatch<SetStateAction<T>>>((item) => {
        return (action) => {
          safeObj.safe && item(action);
        };
      }),
    [set]
  );
}

export function useSafeState<S>(
  init?: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(init as any);
  const [safeSetState] = useSafeSet<S>(setState);
  return [state, safeSetState];
}

type Fun<S> = (prevState: S) => S;
export function useSafeOneState<S>(
  init?: S | (() => S)
): [S, Dispatch<SetStateAction<Partial<S>>>] {
  const [state, setState] = useSafeState<S>(init || ({} as S));
  const mergeSet: Dispatch<SetStateAction<Partial<S>>> = (
    action: SetStateAction<Partial<S>>
  ) => {
    if (typeof action === "function") {
      setState((old) => ({ ...old, ...(action as Fun<Partial<S>>)(old as S) }));
    } else {
      setState((old) => ({ ...old, ...action }));
    }
  };
  return [state, mergeSet];
}

export function useOneState<S>(
  init?: S | (() => S)
): [S, Dispatch<SetStateAction<Partial<S>>>] {
  const [state, setState] = useState<S>(init || ({} as S));
  const mergeSet: Dispatch<SetStateAction<Partial<S>>> = (
    action: SetStateAction<Partial<S>>
  ) => {
    if (typeof action === "function") {
      setState((old) => ({ ...old, ...(action as Fun<Partial<S>>)(old as S) }));
    } else {
      setState((old) => ({ ...old, ...action }));
    }
  };
  return [state, mergeSet];
}
