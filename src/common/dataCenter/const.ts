// 接口正常返回Code
export const RESSUCNO = 0

// 支付状态
export const PAYSTATUS = {
  unkown: 0, // 状态未知
  waitPay: 1, // 待支付
  freePassPaying: 2, // 免密支付中
  paid: 3, // 支付完成
  freePayFailed: 4, // 免密失败
  riskClose: 6, // 订单被风控
  close: 7, // 订单被关闭
  freePayUnknown: 8 // 免密单生成中
}

// 轮询支付状态接口间隔
export const LOOPSPACE = 2000

// 事件触发枚举
export const EVENT_ENUM = {
  GET_PAY_INFO: 'getPayInfo', // 触发getPayInfo请求
  CHANGE_PAY_INFO: 'changePayInfo', // 触发changePayInfo请求
  GET_PAY_STATUS: 'getPayStatus', // 触发changePayInfo请求
  PRE_PAY: 'prePay', // 触发prePay请求
  CALLBACK: 'callback', // 触发callback
  GET_PAY_INFO_RES: 'getPayInfoRes', // 返回getPayInfo的结果
}
