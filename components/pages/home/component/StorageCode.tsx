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

~~~bash
import from 'react-cloud3-storage-widget'

export function(){
  return(
    <ReactStorageWidget />
  )
}
~~~

**Vue**:

~~~bash
import from 'vue-cloud3-storage-widget'

<body>
  <div id="app">
    <vue-storage-widget></vue-storage-widget>
  </div>
</body>
~~~
`;
  return(
    <Modal className="p-0">
      <div className="bg-white flex flex-col relative p-6">
        <div className="flex justify-between items-center mb-5">
          <h4 className="underline">Dev Guidance</h4>
          <CommonModalClose className="mt-[-0.3rem]" onClose={()=>onClose && onClose()} />
        </div>
        <div>
          <BucketCode code={code} />
        </div>
      </div>
    </Modal>
  )
}