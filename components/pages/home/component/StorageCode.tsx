import {Modal} from "@components/modals/Modal";
import {CommonModalClose} from "@components/pages/home/component/CommonModalClose";
import React from "react";
import {BucketCode} from "@components/common/BucketCode";

interface IProps{
  onClose: any
}
export function StorageCode(p: IProps){
  const {onClose} = p
  const code = `
**React**:

~~~jsx
import { DragStorage } from '@cloud3/react-widgets'

export function(){
  return(
    <DragStorage />
  )
}
~~~

**Vue**:

~~~jsx
<script>
import { DragStorage } from '@cloud3/vue-widgets'
</script>

<template>
  <div id="app">
    <DragStorage />
  </div>
</template>
~~~
`;
  return(
    <Modal className="p-0">
      <div className="bg-white min-w-[56rem] flex flex-col relative p-6">
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-2xl">Dev Guidance</h4>
          <CommonModalClose className="mt-[-0.3rem]" onClose={()=>onClose && onClose()} />
        </div>
        <div>
          <BucketCode code={code} />
        </div>
      </div>
    </Modal>
  )
}