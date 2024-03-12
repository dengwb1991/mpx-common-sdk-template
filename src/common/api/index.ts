import {
  RequestObj,
  PlainObject
} from '../typeDeclare/index'
import DataCenter from '../dataCenter/index'
class Api {
  private host: string // 接口 Host
  constructor () {
    this.host = this.getHost(DataCenter.getConfig().env)
  }
  private async post (parmas: RequestObj) {
    const baseParams = DataCenter.getBaseParams()
    delete baseParams.uid
    const mode = __mpx_mode__
    const module = (await import(`./caller/${mode}`)).default
    return module.post({
      ...parmas,
      data: {
        ...baseParams,
        ...parmas.data
      }
    })
  }
  /**
   * 获取支付信息
   */
  public getPayInfo (extra: PlainObject = {}) {
    const pamras = {
      data: extra,
      url: `${this.host}/gulfstream/pay/v2/client/singlePage/getPayInfo`
    }
    return this.post(pamras)
  }
  /**
   * 切换支付渠道
   */
  public changePayInfo (extra: PlainObject = {}) {
    const pamras = {
      data: extra,
      url: `${this.host}/gulfstream/pay/v2/client/singlePage/changePayInfo`
    }
    return this.post(pamras)
  }
  /**
   * 发起支付
   */
  public prePay (extra: PlainObject = {}) {
    const pamras = {
      data: extra,
      url: `${this.host}/gulfstream/pay/v2/client/singlePage/prePay`
    }
    return this.post(pamras)
  }
  /**
   * 查询支付结果
   */
  public getPayStatus (extra: PlainObject = {}) {
    const pamras = {
      data: extra,
      url: `${this.host}/gulfstream/pay/v2/client/singlePage/getPayStatus`
    }
    return this.post(pamras)
  }
  /**
   * 获取Host
   * @param env development、preview、production 或 其他host
   * @returns
   */
  private getHost (env: string): string {
    let host = 'http://127.0.0.1:8888'
    console.log(env)
    if (env) {
      switch (env) {
        case 'development':
          host = 'http://127.0.0.1:8888'
          break
        case 'preview':
          host = 'http://127.0.0.1:8888'
          break
        case 'production':
          host = 'http://127.0.0.1:8888'
          break
        default:
          host = env
          break
      }
    }
    return host
  }
}

export default Api
