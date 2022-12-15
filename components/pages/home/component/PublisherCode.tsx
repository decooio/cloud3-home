import {Modal} from "@components/modals/Modal";
import {CommonModalClose} from "@components/pages/home/component/CommonModalClose";
import React from "react";
import {BucketCode} from "@components/common/BucketCode";

interface IProps{
  onClose: any
}
export function PublisherCode(p: IProps){
  const {onClose} = p
  const code = `
**React**:

~~~bash
import form 'React-demo'
~~~

**Vue**:

~~~bash
import form 'Vue-demo'
~~~
`;
  return(
    <Modal className="p-0">
      <div className="bg-white flex flex-col relative p-5">
        <div className="flex justify-between items-center mb-5">
          <h4 className="underline">Dev Guidance</h4>
          <CommonModalClose className="mt-[-0.5rem]" onClose={()=>onClose && onClose()} />
        </div>
        <div>
          <BucketCode code={code} />
        </div>
      </div>
    </Modal>
  )
}