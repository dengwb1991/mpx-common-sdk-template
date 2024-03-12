/**
 * 多端环境支付、签约等能力 bridge封装
 */
import DataCenter from '../dataCenter/index'
import {
  Func,
  PlainObject,
  PrePayResponseObj
} from '../typeDeclare/index'
class PayBridge {
  public _pay: (params: object, cb: Func) => void
  public viewIsBackground: (result: object) => void
  public bridgeDone: boolean // 支付bridge是否初始化完成 主要针对异步加载端JS
  private viewBackgroundInited: boolean // 是否初始化
  private isWaitingPay: boolean
  private href: string // 记录当前发起支付的地址 尽在web中使用
  constructor () {
    this.bridgeDone = false
    this.viewBackgroundInited = false
    this.isWaitingPay = false
    this.href = ''
    this.init()
  }

  public pay (params: PrePayResponseObj, cb: Func) {
    if (this.bridgeDone) {
      if (__mpx_mode__ === 'web') {
        this.href = location.href
        this.isWaitingPay = true
        this.appViewToFrontBack(params, cb)
      }
      this._pay(params, cb)
    } else {
      // bridge 未初始化完成 操作
    }
  }
  /**
   * 回显
   * @param cb
   */
  private appViewToFrontBack (params: PrePayResponseObj, cb: Func) {
    if (!this.viewBackgroundInited && !!this.viewIsBackground) {
      this.viewBackgroundInited = true
      this.viewIsBackground((result: string | PlainObject) => {
        // 间联支付时 需要多次监听回显，若当前页面非发起支付的页面时，不触发回调查询
        if (params.channel_id === 320 && this.href === location.href) {
          this.isWaitingPay = true
        }
        if (this.isWaitingPay && result === 'visible') { // 后台切前台
          this.isWaitingPay = false
          cb({ from: 'passengerDriverBridge' })
        }
      })
    }
  }

  private init () {
    const Env = DataCenter.getEnv()
    console.log('Env::::', Env)
    if (__mpx_mode__ === 'web') {
      if (Env === 'passenger') {
        import('./bridge/fusion').then((bridge: any) => {
          bridge = bridge.default
          bridge.init().then(() => {
            this.bridgeDone = true
            this._pay = bridge.pay.bind(bridge)
            this.viewIsBackground = bridge.viewIsBackground.bind(bridge)
          })
        })
      }
    }
  }
}

export default PayBridge
