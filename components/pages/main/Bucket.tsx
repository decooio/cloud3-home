import { Icon } from "@components/common/Icon";
import { useGetAuth } from "@lib/hooks/useGetAuth";
import { parseBucketId } from "@lib/utils";
import React, { useMemo, useRef, useState} from "react";
import { BsBucket } from "react-icons/bs";
import { FiChevronRight, FiSearch,FiFile,FiFolder } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useNetwork } from "wagmi";
import { MainLayout } from "./MainLayout";
import axios from "axios";
import {UploadRes} from "@components/pages/home/SectionTop";
import {upload} from "@lib/files";
import {DropDownBtn} from "@components/common/DropDownBtn";
import {Modal, ModalHead} from "@components/modals/Modal";
import {ProgressBar} from "@components/common/ProgressBar";
import {Alert} from "@components/common/Alert";
import {useGateway} from "@lib/hooks/useGateway";
import {Pagination} from "@components/common/Pagination";
import _ from "lodash";
import {useAsync} from "react-use";
import { BucketCode } from "@components/common/BucketCode";

const TopInfo = () => {
  const { bucketId } = useParams();
  const push = useNavigate();
  return (
    <>
      <div className="sticky top-0 bg-white px-8 pt-16 flex items-center pb-5 mb-2">
        <Icon icon={BsBucket} className="text-xl mr-2" />
        <span
          className="mr-2 cursor-pointer"
          onClick={() => {
            push("/buckets");
          }}
        >
          W3Buckets
        </span>
        <Icon icon={FiChevronRight} className="mr-2" />
        <span>{`W3BUCKET(${bucketId})`}</span>
      </div>
      <div className="px-8 pb-8 text-lg border-b-8 border-solid border-[#eeeeee]">
        <div className=" border border-black-1 border-solid px-8 pt-6 pb-5">
          <div className=" text-xl font-medium">Guidance on Storage</div>
          <div className=" my-4">
            Files can be uploaded and decentralized pinned to IPFS by using this
            web interface, or by CLI as shown in the curl sample below.
          </div>
          <BucketCode />
          <div className=" mt-8 text-xl font-medium">Get more references</div>
          <div className=" mt-4 flex flex-wrap">
            <a
              className=" underline text-black-1 mr-5"
              target="_blank"
              href="/general"
            >
              General Dey Guidance
            </a>
            <a
              className=" underline text-black-1 mr-5"
              target="_blank"
              href="/general"
            >
              Hosting Dapps
            </a>
            <a
              className=" underline text-black-1 mr-5"
              target="_blank"
              href="/general"
            >
              NFT Metadata
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export const Bucket = React.memo(() => {
  const { bucketId,ipnsId } = useParams();
  const [ , tokenId] = useMemo(() => parseBucketId(bucketId),[bucketId])
  const push = useNavigate();
  const inputFileRef = useRef(null);
  const inputFolderRef = useRef(null);
  const [upState,setUpState] = useState({ progress: 0, status: 'stop' });
  const [pgNum,setPgNum] = useState(1);
  const [filterText,setFilterText] = useState('')
  const [confirmFilterText,setConfirmFilterText] = useState('')
  const { chain } = useNetwork();
  const [getAuth] = useGetAuth('for_upload')
    const {current} = useGateway()
    const { value: files } = useAsync(async () => {
        const pathRes = await axios.request({
            method: 'POST',
            params:{
                arg: ipnsId
            },
            url: `${current.value}/api/v0/name/resolve`
        });
        const filesRes = await axios.request({
            url: `https://gw-seattle.cloud3.cc${pathRes.data.Path}`
        })
        return filesRes.data
    }, [ipnsId]);


    const {fFiles,total} = useMemo(()=>{
        const filterFileList = _.filter(files,(item)=>{
            return item.name.indexOf(filterText.trim())>-1
        })
        const fFiles = _.chunk(filterFileList,10)
        const total = filterFileList.length
        return {fFiles,total}
    },[files,confirmFilterText])


  const onUploadChange = (file)=>{
      const upFile = file.target.files
      if(!upFile.length) return false
      getAuth(tokenId)
          .then(async (auth) => {
              try {
                  setUpState({ progress: 0, status: 'upload' });
                  const form = new FormData();
                  if (upFile.length === 1) {
                      form.append('file', upFile[0], upFile[0].name);
                  } else if (upFile.length > 1) {
                      for (const f of upFile) {
                          form.append('file', f, f._webkitRelativePath || f.webkitRelativePath);
                      }
                  }
                  const uploadRes = await upload({
                      data: form,
                      endpoint: current.value,
                      authBasic: `Bearer ${auth}`,
                      onProgress: (num)=>{
                          setUpState({ progress: Math.round(num * 99), status: 'upload' });
                      }
                  })
                  let cid = ''
                  let name = ''
                  if (typeof uploadRes === 'string') {
                      const jsonStr = (uploadRes as string).replaceAll('}\n{', '},{');
                      const items = JSON.parse(`[${jsonStr}]`) as UploadRes[];
                      const folder = items.length - 1;
                      cid = items[folder].Hash
                      name = items[folder].Name
                  } else {
                      cid = uploadRes.Hash
                      name = uploadRes.Name
                  }
                  if(!cid || !name){
                      setUpState({ progress: 0, status: 'fail'});
                      return false
                  }
                  await axios.request({
                      data: {
                          cid,
                          name
                      },
                      headers: { Authorization: `Bearer ${auth}` },
                      method: 'POST',
                      url: `https://beta-pin.cloud3.cc/psa/pins`
                  });
                  setUpState({ progress: 100, status: 'success'});
              } catch (e) {
                  setUpState({ progress: 0, status: 'fail' });
                  console.error(e);
                  throw e;
              }
          })
          .catch(console.error)
  }
  const onDropDownChange = (value)=>{
      if(value === 'file'){
          inputFileRef.current.click();
      }else if(value === 'folder') {
          inputFolderRef.current.click();
      }
  }
  const doSearch = ()=>{
      setConfirmFilterText(filterText)
  }
    return (
    <MainLayout menuId={1}>
      <div className="flex-1 h-full overflow-y-auto">
        <div className="relative">
          <TopInfo />
          <div className="p-8 flex-1 text-lg v-full flex flex-col">
            <div className="sticky top-[6.5rem] bg-white w-full flex items-center z-10">
              <DropDownBtn dropData={[{text:'File',icon: FiFile,value: 'file'},{text:'Folder',icon: FiFolder,value: 'folder'}]} text="Upload" onChange={onDropDownChange}/>
              <input ref={inputFileRef} type="file" hidden onChange={onUploadChange} />
              {/*@ts-ignore*/}
              <input ref={inputFolderRef} type="file" hidden webkitdirectory="" directory onChange={onUploadChange} />
              <span className="ml-5">Thundergateway Seattle, US</span>
              <div className="flex-1" />
              <div className="relative w-1/2 h-14 max-w-sm border-solid border-black-1 border rounded overflow-hidden">
                <input className="w-full h-full pl-5 pr-10 active:border-0" onChange={(v)=>setFilterText(v.target.value)} />
                <Icon
                  icon={FiSearch}
                  className="text-2xl absolute top-4 right-2 cursor-pointer"
                  onClick={doSearch}
                />
              </div>
            </div>
            <div className="top-40 bg-white py-4 flex items-center font-medium border-b-1 border-solid border-b-black-1">
              <div className="flex-initial w-2/12 pl-3">File Name</div>
              <div className="flex-initial w-5/12">CID</div>
              <div className="flex-initial w-2/12">Link</div>
              <div className="flex-initial w-1/12">File Size</div>
              <div className="flex-initial w-2/12">TimeStamp</div>
            </div>
            <div className=" text-sm text-gray-6">
              {fFiles && fFiles[pgNum-1] && fFiles[pgNum-1].map((v, index) => (
                <div
                  key={`files_${index}`}
                  className="flex items-center pt-4 pb-5"
                >
                  <div className="flex-initial w-2/12 pl-3">{v.name}</div>
                  <div className="flex-initial w-5/12">{v.cid}</div>
                  <div className="flex-initial w-2/12">Link</div>
                  <div className="flex-initial w-1/12">File Size</div>
                  <div className="flex-initial w-2/12">TimeStamp</div>
                </div>
              ))}
            </div>
            <Pagination total={total} pgSize={10} pgNum={pgNum} onChange={(v)=>{setPgNum(v)}}/>
          </div>
        </div>
      </div>
        {
            upState.status !== 'stop' &&
            <Modal>
                <ModalHead title="Upload File" onClose={()=>{setUpState({progress: 0,status: 'stop'})}} />
                <div
                    className="bg-white mt-5 flex px-6 py-3 cursor-pointer justify-between items-center"
                >
                    {
                        upState.status === 'upload' &&
                        <ProgressBar value={upState.progress} />
                    }
                    {
                        upState.status !== 'upload' &&
                        <Alert text={upState.status === 'success'?'Upload success':'Upload fail'} status={upState.status} />
                    }
                </div>
            </Modal>
        }

    </MainLayout>
  );
});
