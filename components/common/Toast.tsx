import { useStore } from "@lib/store/store";
import React, { useEffect } from "react";
import {Alert} from "@components/common/Alert";

export function Toasts() {
  const { store, update } = useStore();
  const toasts: any[] = store.toasts || [];
  useEffect(() => {
    const task = setInterval(() => {
      update(() => {
        toasts.shift()
        return {toasts}
      })
    }, 3000);
    return ()=>clearInterval(task)
  }, [toasts]);
  return (
    <div className="fixed top-5 right-5 z-[50]">
      {
        toasts.map((toast, i) => {
          return(
            <div
              key={`toasts${i}`}
              className="flex py-2 cursor-pointer justify-between items-center"
            >
              <Alert text={toast.msg} status={toast.type} />
            </div>
          )
        })
      }
    </div>
  );
}
