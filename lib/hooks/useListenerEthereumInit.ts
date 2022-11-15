import {useEffect, useState} from "react";

export function useListenerEthereumInit() {
  const [isInit,setIsInit] = useState(false)
  useEffect(()=>{
    if ((window as Window).ethereum) {
      // alert(1)
      setIsInit(true)
    } else {
      window.addEventListener(
        'ethereum#initialized',
        ()=>{
          console.info('ethereum---xxxxx')
          setIsInit(true)
        },
        { once: true },
      );
      setTimeout(() => {
        // handleEthereum();
        setIsInit(true)
      }, 3000);
    }
  },[])
  return [isInit,setIsInit]
}
