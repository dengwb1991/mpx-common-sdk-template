import {
  Func,
  PlainObject
} from '../../typeDeclare/index'
import Env from '../../dataCenter/env'
import DataCenter from '../../dataCenter/index'
import { bindVisibilityChange } from '../../utils/index'

const noop = () => {}

class PassengerBridge {
  private isReady: boolean
  private staring: boolean
  private schema: string
  private isCommonPayCB: boolean // 是否是支付回调返回 用于手动回显判断
  private fusionBridge: any
  constructor () {
    this.isReady = false
    this.staring = false
    this.isCommonPayCB = false
  }

  public init () {
    const that = this
    if (that.staring) {
      return
    }
    that.staring = true
    return new Promise((resolve: any, reject: any) => {
      that.staring = false
      that.isReady = true
      that.fusionBridge = ''
      resolve()
    })
  }

  public pay (params: any, cb: Func) {
    // let commonPay
    const that = this
    this.isCommonPayCB = false
    that.bridge((Bridge) => {
      console.log('payopts:::', params)
      /**
       *
       * payopts: {
       *   common_params: {
       *     appid, noncestr ...
       *   },
       *   channel_id: '127'
       * }
       *
       * payopts: {
       *   common_params: {
       *     pay_string
       *   }
       *   channel_id: '128'
       * }
       */
      const fusionBridge = Bridge.CommonModule || Bridge
      switch (String(params.channel_id)) {
        case '127':
          fusionBridge.commonPay({
            type: 'weixin',
            pay_params: params.common_params
          }, (res: PlainObject) => {
            const result = res.result ? res.result : res
            that.payResultHandle(result, cb)
          }) // 端内支付考虑 fusion
          break
        case '128':
          fusionBridge.commonPay({
            type: 'ali',
            pay_params: {
              alipaySchema: that.schema,
              orderStr: params.common_params.pay_string,
            },
          }, (res: PlainObject) => {
            const result = res.result ? res.result : res
            that.payResultHandle(result, cb)
          })
          break
        case '166': // 滴滴支付
          const { timeStamp, out_trade_no, sign, merchant_id, prepayid, sign_type, nonceStr } = params.common_params
          const token = DataCenter.getBaseParams().token || ''
          fusionBridge.open19Pay({
            outTradeNo: out_trade_no,
            merchantId: merchant_id,
            prepayId: prepayid,
            noncestr: nonceStr,
            timestamp: timeStamp,
            signType: sign_type,
            sign,
            token
          }, (res: PlainObject) => {
            if (Object.prototype.toString.call(res) === '[object Object]') {
              res = res[0]
            }
            if (['0', '1'].includes(String(res))) {
              this.payResultHandle({ pay_result: 0 }, cb)
            } else {
              this.payResultHandle({ pay_result: 2 }, cb)
            }
          })
          break
        case '320': // 微信间联支付
          if (fusionBridge.CashierBridgeModule && fusionBridge.CashierBridgeModule.openWxJianlian) {
            fusionBridge.CashierBridgeModule.openWxJianlian(params.common_params, (result: PlainObject) => {
              /**
               * result = { code: 5, message: '' }
               * SPaySDKResultUnknow = -1,        //支付结果未知
               * SPaySDKResultSucceed = 0,       //支付成功
               * SPaySDKResultFailed = 1,    //支付失败
               * SPaySDKResultCanceled = 2,      //用户取消支付
               * SPaySDKResultRepeated = 3,      //重复支付
               * SPaySDKResultClosed = 4,          //支付关闭
               * SPaySDKResultNotSupport = 5,    //支付app未安装或者版本过低不支持
               * SPaySDKResultPreparing = 6,   // 签约准备中
               * SPaySDKResultProcessing = 7, //签约处理中（包括填写信息、提交表单等）
               * SPaySDKResultChecking= 8,    //签约处理中（查询签约结果）
               */
              if (result && result.code) {
                switch (String(result.code)) {
                  case '1':
                    cb({
                      errno: 1,
                      errmsg: result.message || '支付失败',
                      from: 'FusionPay'
                    })
                    break
                  case '5':
                    cb({
                      errno: 1,
                      errmsg: result.message || '支付App未安装或者版本过低不支持',
                      from: 'FusionPay'
                    })
                    break
                  default:
                    break
                }
              }
            })
          } else {
            cb({
              errno: 1,
              errmsg: 'App版本较低，请升级或更换支付方式',
              from: 'FusionPay'
            })
          }
          break
        default:
          // nothing
      }
    })
  }

  private payResultHandle (res: PlainObject, cb: Func) {
    let errMsg
    this.isCommonPayCB = true
    switch (res.pay_result) {
      case 0:
        errMsg = {
          errno: 0,
          errmsg: '支付成功'
        }
        break
      case 1:
        errMsg = {
          errno: 1,
          errmsg: '支付失败',
        }
        break
      case 2:
        errMsg = {
          errno: 2,
          errmsg: '支付取消',
        }
        break
      default:
        // nothing
    }
    cb({
      ...errMsg,
      from: 'FusionPay'
    })
  }

  public viewIsBackground (cb: Func = noop) {
    this.bridge(() => {
      const realCb = (...args: any[]) => {
        setTimeout(() => {
          if (!this.isCommonPayCB) {
            cb(...args)
          }
        }, 500)
      }
      ;(bindVisibilityChange as any).addHandler(realCb)
    })
  }

  private bridge (fn: Func) {
    if (this.fusionBridge || this.isReady) {
      fn(this.fusionBridge)
    }
  }
}

export default new PassengerBridge()
