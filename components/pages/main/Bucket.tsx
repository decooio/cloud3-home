import { Icon } from "@components/common/Icon";
import {useGetAuth, useGetAuthForGet} from "@lib/hooks/useGetAuth";
import {formatFileSize, parseBucketId, shortStr} from "@lib/utils";
import React, {useEffect, useMemo, useRef, useState} from "react";
import { BsBucket,BsQuestionCircle } from "react-icons/bs";
import { FiChevronRight, FiSearch,FiFile,FiFolder,FiCopy } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
// import { useNetwork } from "wagmi";
import { MainLayout } from "./MainLayout";
import axios, { CancelTokenSource } from 'axios';
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
import moment from "moment";
import ReactTooltip from 'react-tooltip';
import classnames from "classnames";
import copy from 'copy-to-clipboard';
import {useOnce} from "@react-spring/shared";
import {genUrl, pinUrl} from "@lib/http";
import {useToast} from "@lib/hooks/useToast";


const TopInfo = () => {
  const { bucketId } = useParams();
  const push = useNavigate();
  return (
    <>
      <div className="sticky top-0 bg-white px-8 pt-16 flex items-center pb-5 mb-2 min-w-[62rem]">
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
      <div className="px-8 pb-8 text-lg border-b-8 border-solid border-[#eeeeee] min-w-[62rem]">
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
              href="https://docs.cloud3.cc/w3bucket/aboutnft"
            >
              General Guidance on W3Bucket
            </a>
            <a
              className=" underline text-black-1 mr-5"
              target="_blank"
              href="https://docs.cloud3.cc/w3bucket/uploadfile"
            >
              Using APIs and W3Auth
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
const getLocalFileListByBucketId = (bucketId)=>{
  return new Promise((resolve,reject) => {
    const files = localStorage.getItem(bucketId+'_files')
    if(files){
      resolve(JSON.parse(files))
    }else {
      reject()
    }
  })
}
const setLocalFileListByBucketId = (bucketId,files)=>{
  return new Promise((resolve => {
    if(files) localStorage.setItem(bucketId+'_files',JSON.stringify(files))
    resolve(true)
  }))
}
export const Bucket = React.memo(() => {
  const { bucketId,ipnsId } = useParams();
  const [ , tokenId] = useMemo(() => parseBucketId(bucketId),[bucketId])
  const inputFileRef = useRef(null);
  const inputFolderRef = useRef(null);
  const [upState,setUpState] = useState({ progress: 0, status: 'stop', errorMsg:'' });
  const [pgNum,setPgNum] = useState(1);
  const [filterText,setFilterText] = useState('')
  const [confirmFilterText,setConfirmFilterText] = useState('')
  const [localFileList,setLocalFileList] = useState<any>([])
  const toast = useToast()
  const [cancelUp, setCancelUp] = useState<CancelTokenSource | null>(null);
  const [getAuth] = useGetAuth('for_upload',false,1)
  const [getAuthForGetDetail,authForDetail] = useGetAuthForGet();

  useEffect(() => {
    ReactTooltip.rebuild();
  },[localFileList]);

  useOnce(()=>{
    getLocalFileListByBucketId(bucketId).then(res=>{
      setLocalFileList(res)
    }).catch(()=>{
      setLocalFileList([])
    })
  })
  // const { chain } = useNetwork();
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
      url: `${current.value}${pathRes.data.Path}`
    })
    return filesRes.data
  }, [ipnsId]);

  const { value: detail } = useAsync(async () => {
    let auth = authForDetail
    if(!auth){
      auth = await getAuthForGetDetail(tokenId)
    }
    const res = await axios.request({
      headers: { Authorization: `Bearer ${auth}` },
      method: 'GET',
      url: genUrl(`/auth/bucket/${ipnsId}`)
    });
    return res.data.data
  }, [ipnsId]);


  const {fFiles,total} = useMemo(()=>{
    let uploadFiles = []
    if(localFileList){
      uploadFiles = localFileList
    }
    let filterFileList = _.filter(uploadFiles,(item)=>{
      return item.name.indexOf(confirmFilterText.trim())>-1
    })
    filterFileList = filterFileList.sort(function(a, b) {
      return b.createTime - a.createTime;
    });
    const fFiles = _.chunk(filterFileList,10)
    const total = filterFileList.length
    return {fFiles,total}
  },[confirmFilterText,localFileList])


  useMemo(()=>{
    if(localFileList && localFileList.length>0){
      setLocalFileListByBucketId(bucketId,localFileList)
    }
  },[localFileList])

  useMemo(()=>{
    if(files && files.length){
      if(localFileList){
        localFileList.map(v=>{
          for(let i=0; i<files.length; i++){
            if(v.isNew && files[i].cid === v.cid){
              delete v.isNew
              break
            }
          }
        })
        const arr = files.concat(localFileList)
        const res = new Map();
        setLocalFileList(arr.filter((item) => !res.has(item.cid) && res.set(item.cid, 1)))
      }else {
        setLocalFileList(files)
      }
    }
  },[files])

  const onUploadChange = (file)=>{

    const upFile = file.target.files
    let fileSize = 0
    if(!upFile.length) return false
    let canUp = true
    for(let i = 0; i<upFile.length; i++){
      fileSize += upFile[i].size
      if(upFile[i].name.length>64){
        toast.error('The file name cannot exceed 64 characters.')
        canUp = false
        break
      }
    }
    if(detail){
      const {maxStorageSize,usedStorageSize} = detail
      if(fileSize>(maxStorageSize-usedStorageSize)){
        toast.error('No enough space for this file/folder!')
        return false
      }
    }
    if(!canUp) return false
    getAuth(tokenId)
      .then(async (auth) => {
        try {
          let fileType = 0
          const cancel = axios.CancelToken.source();
          setCancelUp(cancel);
          setUpState({ progress: 0, status: 'upload',errorMsg:'' });
          const form = new FormData();
          if (upFile.length === 1) {
            form.append('file', upFile[0], upFile[0].name);
            inputFileRef.current.value = '';
          } else if (upFile.length > 1) {
            for (const f of upFile) {
              form.append('file', f, f._webkitRelativePath || f.webkitRelativePath);
            }
            fileType = 1
            inputFolderRef.current.value = '';
          }
          const uploadRes = await upload({
            cancelToken: cancel.token,
            data: form,
            endpoint: current.value,
            authBasic: `Bearer ${auth}`,
            onProgress: (num)=>{
              setUpState({ progress: Math.round(num * 99), status: 'upload',errorMsg:'' });
            }
          })
          setCancelUp(null);
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
            setUpState({ progress: 0, status: 'fail',errorMsg:''});
            return false
          }
          const res = await axios.request({
            data: {
              cid,
              name,
              meta: {
                gatewayId: 1
              }
            },
            cancelToken: cancel.token,
            headers: { Authorization: `Bearer ${auth}` },
            method: 'POST',
            url: pinUrl('/psa/pins')
          });
          const {error} = res.data
          if(error){
            setUpState({ progress: 0, status: 'fail',errorMsg: error.details?error.details:'' });
            return false
          }
          setUpState({ progress: 100, status: 'success',errorMsg:''});
          setLocalFileList(localFileList.concat([{name,cid,fileSize,fileType,createTime: moment().format('X').valueOf(),isNew: true}]))
        } catch (e) {
          inputFileRef.current.value = '';
          inputFolderRef.current.value = '';
          // setUpState({ progress: 0, status: 'fail' });
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
  const onInputKeyDownSearch = (e)=>{
    const evt = window.event || e;
    if (evt.keyCode == 13) {
      doSearch()
    }
  }
  const onClose = ()=>{
    if(upState.status === 'upload' && cancelUp){
      cancelUp.cancel("stop");
      setCancelUp(null)
    }

    setUpState({progress: 0,status: 'stop',errorMsg: ''})
  }
  return (
    <MainLayout menuId={1}>
      <div className="flex-1 h-full overflow-y-auto">
        <div className="relative">
          <TopInfo />
          <div className="p-8 flex-1 text-lg v-full flex flex-col min-w-[62rem]">
            <div className="sticky top-[6.5rem] bg-white w-full flex items-center z-10">
              <DropDownBtn dropData={[{text:'File',icon: FiFile,value: 'file'},{text:'Folder',icon: FiFolder,value: 'folder'}]} text="Upload" onChange={onDropDownChange}/>
              <input ref={inputFileRef} type="file" hidden onChange={onUploadChange} />
              {/*@ts-ignore*/}
              <input ref={inputFolderRef} type="file" hidden webkitdirectory="" directory onChange={onUploadChange} />
              <span className="ml-5">Thunder Gateway Seattle, US</span>
              <div className="flex-1" />
              <div className="relative w-1/2 h-12 max-w-sm border-solid border-black-1 border rounded overflow-hidden">
                <input className="w-full h-full pl-5 pr-10 active:border-0" onKeyDown={onInputKeyDownSearch} onChange={(v)=>setFilterText(v.target.value)} />
                <Icon
                  icon={FiSearch}
                  className="text-2xl absolute top-[0.7rem] right-2 cursor-pointer"
                  onClick={doSearch}
                />
              </div>
            </div>
            <div className="sticky top-36 bg-white py-4 flex items-center font-medium border-b-1 border-solid border-b-black-1 pt-5">
              <div className="flex-initial w-[25%] md:w-[20%] pl-3">File Name</div>
              <div className="flex-initial w-[20%] md:w-[25%]">CID</div>
              <div className="flex-initial w-[30%]">Link</div>
              <div className="flex-initial w-[10%]">File Size</div>
              <div className="flex-initial w-[15%]">TimeStamp</div>
            </div>
            <div className=" text-sm text-gray-6">
              {fFiles && fFiles[pgNum-1] && fFiles[pgNum-1].map((v, index) => (
                <div
                  key={`files_${index}`}
                  className={classnames('flex items-center pt-4 pb-8',v.isNew?'text-gray-300':'')}
                >
                  <div className="flex-initial w-[25%] md:w-[20%] pl-3">
                    <div className="flex items-center pr-8">
                      <span className="truncate" data-tip={v.name.length>20?v.name:''}>{v.name}</span>
                      {
                        v.fileType === 1 &&
                        <Icon className="ml-2 min-w-[14px]" icon={FiFolder} />
                      }
                    </div>

                  </div>
                  <div className="flex-initial w-[20%] md:w-[25%]">
                    <span data-tip={v.cid} data-for="cidColumn">{shortStr(v.cid,10,10)}</span>
                  </div>
                  <div className="flex-initial w-[30%] truncate pr-8" data-for="linkColumn" data-tip={`${current.value}/ipfs/${v.cid}`}>{`${current.value}/ipfs/${v.cid}`}</div>
                  <div className="flex-initial w-[10%]">{formatFileSize(v.fileSize)}</div>
                  <div className="flex-initial w-[15%] text-gray-6">{v.isNew?<span data-tip={`The ${v.fileType === 0?'file':'folder'} has been successfully uploaded to your bucket. It takes several minutes to finalize the decentralized storage and IPNS update processes.`}><Icon icon={BsQuestionCircle} /></span>:moment(v.createTime*1000).format('YYYY-MM-DD HH:mm:ss')}</div>
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
          <ModalHead title="Upload File" onClose={onClose} />
          <div
            className="bg-white mt-5 flex  py-3 cursor-pointer justify-between items-center h-20"
          >
            {
              upState.status === 'upload' &&
              <ProgressBar value={upState.progress} />
            }
            {
              upState.status === 'success' &&
              <Alert text={'Upload successful'} status={upState.status} />
            }
            {
              upState.status === 'fail' &&
              <Alert text={upState.errorMsg?upState.errorMsg:'Upload fail'} status={upState.status} />
            }
            {
              upState.status === 'cancel' &&
              <Alert text={'Upload cancel'} status={"fail"} />
            }
          </div>
        </Modal>
      }
      <ReactTooltip
        id="cidColumn"
        effect="solid"
        isCapture={true}
        delayHide={250}
        clickable={true}
        getContent={(cid) => {
          return (
            <div className="flex items-center">
              <div className="inline-block w-[13rem] break-words">
                {cid}
                <Icon className="ml-2 cursor-pointer inline-block" onClick={()=>{copy(cid);toast.success('copy success')}} icon={FiCopy} />
              </div>
            </div>
          );
        }} />
      <ReactTooltip
        id="linkColumn"
        effect="solid"
        isCapture={true}
        delayHide={250}
        clickable={true}
        getContent={(link) => {
          return (
            <div className="flex items-center">
              <div className="inline-block w-[15rem] break-words">
                {link}
                <Icon className="ml-2 cursor-pointer inline-block" onClick={()=>{copy(link);toast.success('copy success')}} icon={FiCopy} />
              </div>
            </div>
          );
        }} />
    </MainLayout>
  );
});
