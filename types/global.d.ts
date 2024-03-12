export {};

interface PlainObj {
  [key: string]: any
}
declare global {
  interface Window {
    dbridge: any,
    D: any,
    webviewUtil: any,
    Fusion: any,
    sdk: any,
    $raven: any,
    paybackWXA:(ret: PlainObj, err: PlainObj) => void,
    paybackAlipay: (ret: PlainObj) => void,
    cmblapi: any,
    CCBBridge: any,
    mbspay: any,
    cupBridge: any,
    qjsdkBridge: any,
    system: any,
  }
  const _TARGET_ENV: string
}
