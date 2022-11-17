import axios from "axios";
import {DeCloudLink} from "@lib/config";

export interface UploadRes {
  Hash: string;
  Size: string;
  Name: string;
  items?: UploadRes[];
}

const AuthBasic = "Basic ZXRoLTB4MEVDNzJGNEQ5MWVhN2ZiRjAyZTY2NUQzZDU5QzQ3MmVjY2M0ZWZFZDoweDc3NDdmNDkxMWNhOWY2YWJjODE0MTgxZTkzZmM1YjdlNzQ4MGIwYzM0ZGRmOWFmNGQ4NjQ3OTRiZmYzY2EzMTg2MzQyNWEwZDRjZjAyOTA1Mjc5MTIwNDliYjJlYTRkMTM1OGZlZjQ3ZDU4YzBmMTQxNjI3ZmMzMTIwNzMwODdjMWI";
export async function upload({
                               data,
                               endpoint = DeCloudLink,
                               authBasic = AuthBasic,
                               onProgress,
                               cancelToken = axios.CancelToken.source().token,
                             }:{
  data: FormData,
  endpoint?: string,
  authBasic?: string ,
  cancelToken?: any
  onProgress?: (num: number) => void,},
) {

  const upResult = await axios.request<UploadRes>({
    data,
    cancelToken,
    headers: { Authorization: authBasic },
    method: "POST",
    onUploadProgress: (p) => {
      if (onProgress) onProgress(p.progress);
    },
    params: { pin: true },
    url: `${endpoint}/api/v0/add`,
  });
  return upResult.data;
}
