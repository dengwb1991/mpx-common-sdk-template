const UA = (window && window.navigator && window.navigator.userAgent) || ''

const alipayInfo = UA.match(/AlipayClient\/([\d\.]+)/i)
const isAlipay = !!alipayInfo
const alipayVersion = alipayInfo && alipayInfo[1]

const wechatInfo = UA.match(/MicroMessenger\/([\d\.]+)/i)
const isWechat = !!wechatInfo
const wechatVersion = wechatInfo && wechatInfo[1]

const wxworkInfo = UA.match(/wxwork\/([\d\.]+)/i)
const isWxWork = !!wxworkInfo // 企业微信

const isMqq = /QQ\/([\d\.]+)/i.test(UA)
const mqqInfo = UA.match(/QQ\/([\d\.]+)/i)
const mqqVersion = mqqInfo && mqqInfo[1]

const isAndroid = /Android/i.test(UA)
const isIOS = /iphone|ipad|ipod|ios/i.test(UA)

const withFusion = /fusionkit/i.test(UA)
const withDingTalk = /dingtalk/i.test(UA)

const paypayInfo = UA.match(/jp.pay2.app/i)
const isPayPay = !!paypayInfo

// 招行
const mpbankReg = /MPBank/i
const isMpbank = !!mpbankReg.exec(UA)

// 是否是华为快应用
const isHuaWeiQuickApp = /^(?=.*hap)(?=.*huawei)(?=.*fastapp).*$/i.test(UA)

// 建行 但是建行的window.CCBBridge有延时，所以通过兜底逻辑在config传runtime='ccbank'来解决
const isCCBank = !!(window && window.CCBBridge)
// 银联云闪付
const isUnionPay = !!(window && window.cupBridge)

// 货运
const isFreight = /freight/i.test(UA)

export default {
  UA,
  alipayVersion,
  isAlipay,
  isMqq,
  isWechat,
  isWxWork,
  wechatVersion,
  mqqVersion,
  isAndroid,
  isIOS,
  withFusion,
  withDingTalk,
  paypayInfo,
  isPayPay,
  isMpbank,
  isCCBank,
  isUnionPay,
  isHuaWeiQuickApp,
  isFreight,
}
