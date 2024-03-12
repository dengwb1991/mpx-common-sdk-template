import Base from './base'
import RavenEvent from '../raven/event'
/**
 * 控制整个声明周期数据流
 */
class DataCenter extends Base {
  [key: string]: any
  private options: any // 存储与服务端协议交互的数据
  private config: any // 存储收银台配置数据
  private pay_channels: any // getPayInfo获取 用于调用切换支付、发起支付时入参使用
  private order_identifier: string // 业务订单号，如 out_trade_id、oid 等均合并为该字段内
  private _transfer: any // 微信间联支付需要的数据
  private external_channel_id: number // 当前选中的外部支付渠道
  private user_select: string // 当前选择的渠道
  constructor () {
    super()
    this.options = {}
    this.config = {
      env: 'production', // 请求环境 development preview production 默认为 production
      'miniapp_env': 0, // 间联支付跳转至小程序环境 0:正式版 1:开发版 2:体验版 默认为0
      style: {}, // 样式配置
    }
    this.pay_channels = []
    this.order_identifier = ''
    this._transfer = {}
    this.external_channel_id = 0
    this.user_select = ''
  }

  public setConfig (options: any = {}, config: any = {}) {
    this.options = Object.assign({}, this.options, options)
    this.config = Object.assign({}, this.config, config)
    this.setRavenConfig()
  }

  public getConfig () {
    return this.config
  }

  public get (key: string): any {
    return this[key]
  }

  public set (key: string, val: any) {
    this[key] = val
  }
  private setRavenConfig () {
    const { uid, order_identifier, receipt_snapshot } = this.options
    const { appid } = this.getBaseParams()
    RavenEvent.setConfig({
      uid,
      order_identifier,
      receipt_snapshot,
      wx_app_id: appid,
      app_version: this.getBaseParams().appversion,
      scene: this.getBaseParams().scene
    })
  }
  /**
   * 获取接口通用的入参
   */
  public getBaseParams () {
    return {
      lang: 'zh-CN',
      appversion: this.getAppVersion(),
      scene: 'Embeded', // 代表嵌入模式
      sponsor_type: this.getSponsorType(),
      from: this.getDataFrom(),
      tc_terminal: this.getTcTerminal(),
      app_uni_id: this.getAppUniId(),
      wxAppid: this.getWxAppid(), // 后面需要确认 接口传入的字段是否是 wxAppid 若更改需要再其他引用的wxAppid都要更改
      sdkversion: this.getSdkVersion(),
      ...this.options
    }
  }
}

export default new DataCenter()
