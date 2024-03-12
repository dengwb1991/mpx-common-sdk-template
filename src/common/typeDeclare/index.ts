export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'

// export interface Func {
//   (...rest: any[]): any,
//   _isBuiltIn?: boolean
// }

export interface PlainObject {
  [key: string]: any
}

export interface RequestObj {
  url: string
  method?: Method
  data?: any
}

export interface ResponseObj {
  status?: number
  error?: number
  errno: string | number
  msg?: string
  errmsg: string
  errMsg?: string
  from?: string
  data?: any
  statusCode?: number
}

export type Func = (...rest: any[]) => any

// bridge 返回的结果
export interface BridgeResult {
  errno: number | string // 0：成功 1：失败 2：取消
  errmsg?: string
  from: string // 来源那个bridge
}

/**
 * getPayInfo接口返回间联支付所需要的数据
 */
export interface WxminiappTransferData {
  miniapp_prepay_params: string // 透传给小程序 _transfer
  wxminiapp_code: string // 所跳转至小程序的原始ID
  wxminiapp_url: string // 所跳转至小程序的链接地址
}

/**
 * prePay接口返回的数据
 */
export interface PrePayResponseObj {
  channel_id: number // 当前外部支付渠道号
  result_type: number // 结果类型 1：待支付
  common_params: PlainObject // 支付需要的数据
}

export interface CatchErrObj {
  code?: number // 收银台定义错误code
  msg?: string  // API 返回错误信息 用于排查
}

export interface throwErrObj {
  errno: number // 业务返回错误号
  errmsg: string // 业务返回错误信息 用于前端提示
  code?: number // 收银台定义错误code
  msg?: string  // API 返回错误信息 用于排查
}