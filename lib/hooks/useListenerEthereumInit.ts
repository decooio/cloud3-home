import {useEffect, useState} from "react";

export function useListenerEthereumInit() {
  const [isInit,setIsInit] = useState(false)
  useEffect(()=>{
    console.info(window?.ethereum)
    // if ((window as Window).ethereum) {
    //   // alert(1)
    //   console.info(window)
    //   console.info(window?.ethereum)
    //   setIsInit(true)
    // } else {
    //   console.info("xia")
    //   console.info(window)
    //   window.addEventListener(
    //     'ethereum#initialized',
    //     ()=>{
    //       console.info('ethereum---xxxxx')
    //       setIsInit(true)
    //     },
    //     { once: true },
    //   );
    //   setTimeout(() => {
    //     // handleEthereum();
    //     setIsInit(true)
    //   }, 3000);
    // }
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
  },[])
  return [isInit,setIsInit]
}
