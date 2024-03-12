import { commonTrackEvent } from './common'

class RavenEvent {
  private queue: any
  private data: any
  private init: boolean
  private config: any
  private raven: any
  constructor () {
    this.queue = []
    this.data = {}
    this.init = false
    this.config = {}
    this.raven = ''
  }
  async setConfig (data: any) {
    const { version } = await import('../../../package.json')
    this.config = this.getConfig
    this.data = Object.assign({}, this.data, data, { sdk_version: version })
    const { phone = '0000000000', uid, order_identifier, receipt_snapshot } = data
    let id = ''
    if (uid) {
      id = uid
    } else if (order_identifier) {
      id = order_identifier.replace(/[a-zA-Z]|\_|\-|\=/g, '')
    } else if (receipt_snapshot) {
      const receiptSnapshot = JSON.parse(receipt_snapshot)
      id = receiptSnapshot.order_id
    }

    if (window.$raven) {
      window.$raven.setConfig({
        phone,
        uid: id || uid,
        appId: 1308,
        pool: false
      })
      this.raven = window.$raven
      this.init = true
    }
    // this.queueAction()
  }
  /**
   * 设置raven之前，先获取raven中是否已经被注册过，将其配置进行暂存，
   */
  getConfig () {
    return window.$raven && window.$raven.getConfig()
  }
  /**
   * 重置raven配置
   */
  resetConfig () {
    if (window.$raven && this.config.appId) {
      window.$raven.setConfig(this.config || {})
    }
  }
  /**
   * 处理队列中的埋点
   */
  queueAction () {
    if (this.queue.length) {
      const { type, eventId, attrs, url, body, res } = this.queue.shift()
      if (type === 'trackEvent') {
        this.trackEvent(eventId, attrs)
      }
      if (type === 'trackRequest') {
        const done = this.trackRequest(url, body)
        done && done(null, res)
      }
      this.queueAction()
    }
  }
  /**
   * 插入公共属性 所有的埋点都会传入该属性
   */
  setCommonData (data: any) {
    this.data = Object.assign({}, this.data, data)
  }
  /**
   * 触发埋点事件
   * @param {*} eventId
   * @param {*} attrs
   * @returns
   */
  trackEvent (eventId: string, attrs?: any) {
    return commonTrackEvent.call(this, eventId, attrs, 'web')
  }
  pushRequest (url: string, body: any, res: any) {
    this.queue.push({ // 将初始化之前的埋点存入队列中，等初始化之后执行
      type: 'trackRequest',
      url,
      body,
      res
    })
  }
  trackRequest (url: string, body: any) {
    if (this.init) {
      return window.$raven.trackRequest(url, body)
    }
    return null
  }
}

export default new RavenEvent()
