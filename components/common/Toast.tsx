import { useStore } from "@lib/store/store";
import React, { useEffect } from "react";
import {Modal, ModalHead} from "@components/modals/Modal";
import {Alert} from "@components/common/Alert";


export function Toasts() {
  const { store, update } = useStore();
  const toasts: any[] = store.toasts || [];
  return (
    <div>
      {
        toasts.map((toast, i) => (
          <Modal>
            <ModalHead title="Tips" onClose={()=>{
              update({
                toasts: toasts.filter((item) => item !== toast),
              })
            }} />
            <div
              className="bg-white mt-5 flex  py-3 cursor-pointer justify-between items-center h-20"
            >
              <Alert text={toast.msg} status={toast.type} />
            </div>
          </Modal>
        ))
      }
    </div>
  );
}
