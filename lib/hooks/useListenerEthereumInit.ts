import {useState} from "react";

export function useListenerEthereumInit() {
  const [isInit,setIsInit] = useState(false)
  if ((window as Window).ethereum) {
    setIsInit(true)
  } else {
    window.addEventListener(
      'ethereum#initialized',
      ()=>{
        setIsInit(true)
      },
      { once: true },
    );
    setTimeout(() => {
      // handleEthereum();
      setIsInit(true)
    }, 3000);
  }
  return [isInit,setIsInit]
}
