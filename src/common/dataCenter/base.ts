import Env from './env'
import {
  PlainObject
} from '../typeDeclare/index'

export default class Base {
  constructor () {}
  /**
   * 获取当前环境变量
   */
  public getEnv () {
    let runtime = ''
    if (__mpx_mode__ === 'web') {
      if (Env.isMpbank) {
        runtime = 'mpbank'
      } else if (Env.isHuaWeiQuickApp) {
        runtime = 'huaweiquick'
      } else if (Env.isAlipay) {
        runtime = 'aliwebapp'
      } else if (Env.isWxWork) {
        runtime = 'wxwork'
      } else if (Env.withDingTalk) {
        runtime = 'dingding'
      } else if (Env.isWechat) {
        runtime = 'wxwebapp'
      } else if (Env.isFreight) {
        runtime = 'fusion'
      } else if (Env.withFusion) {
        runtime = 'fusion'
      } else if (Env.isMqq) {
        runtime = 'mqqwebapp'
      } else if (Env.isPayPay) {
        runtime = 'paypaywebapp'
      } else if (Env.isCCBank) {
        runtime = 'ccbank'
      } else if (Env.isUnionPay) {
        runtime = 'unionpay'
      }
    }
    return runtime || __mpx_mode__
  }
  /**
   * 接口必传参数
   */
  public getDataFrom () {
    const env = this.getEnv()
    let typeMap: PlainObject = {}
    // web环境
    if (__mpx_mode__ === 'web') {
      typeMap = {
        wxwebapp: 'wlwebapp',
        wxwork: 'wlwebapp',
        wlWebapp: 'wlwebapp', // 用于只展示微信支付渠道
        aliWebapp: 'aliwebapp', // 用于只展示支付宝支付渠道
        dingding: 'aliwebapp',
        mqqwebapp: 'qqwebapp',
        aliwebapp: 'aliwebapp',
        driver: 'webapp',
        passenger: 'webapp',
        mpbank: 'cmbwebapp',
        ccbank: 'ccbwebapp',
        unionpay: 'unionpaywebapp',
        bocompay: 'bocompaywebapp',
        wx: 'miniapp',
        ali: 'aliminiapp',
        qq: 'qqminiapp',
        transfer: '1', // 大额转账
        huaweiquick: 'quickapp', // 华为快应用
      }
    }
    // 微信小程序环境
    if (__mpx_mode__ === 'wx') {
      typeMap = {
        wx: 'miniapp'
      }
    }
    // 支付宝小程序环境
    if (__mpx_mode__ === 'ali') {
      typeMap = {
        ali: 'aliminiapp'
      }
    }
    if (__mpx_mode__ === 'qq') {
      typeMap = {
        qq: 'qqminiapp'
      }
    }
    return typeMap[env] || ''
  }
  /**
   * 接口必传参数
   */
  public getSponsorType () {
    const env = this.getEnv()
    let typeMap: PlainObject = {}
    // web环境
    if (__mpx_mode__ === 'web') {
      typeMap = {
        paypaywebapp: '14',
        wxwebapp: '8',
        aliwebapp: '2',
        fusion: '0',
        driver: '0',
        passenger: '7',
        mpbank: '1',
        ccbank: '1',
        unionpay: '1',
        bocompay: '1',
        wx: '10',
        ali: '14',
        qq: '10'
      }
    }
    // 微信小程序环境
    if (__mpx_mode__ === 'wx') {
      typeMap = {
        wx: '10'
      }
    }
    // 支付宝小程序环境
    if (__mpx_mode__ === 'ali') {
      typeMap = {
        ali: '14'
      }
    }
    if (__mpx_mode__ === 'qq') {
      typeMap = {
        qq: '10'
      }
    }
    return typeMap[env] || '1'
  }
  /**
   * 接口参数
   */
  public getTcTerminal () {
    const tc = ''
    return tc
  }
  /**
   * 接口参数 获取包名
   */
  public getAppUniId () {
    const id = ''
    return id
  }
  /**
   * 获取APP version
   */
  public getAppVersion () {
    const env = this.getEnv()
    const typeMap: PlainObject = {}
    return typeMap[env] || '6.4.12'
  }
  /**
   * 获取AppId
   */
  public getWxAppid () {
    const env = this.getEnv()
    const typeMap: PlainObject = {}
    return typeMap[env] || ''
  }
  /*
   * 获取sdkversion
   * 针对于展示间联支付渠道
   */
  public getSdkVersion () {
    const version = ''
    return version
  }
}
