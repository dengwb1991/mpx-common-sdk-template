import eventBus from './common/eventBus/index'
import { EVENT_ENUM } from './common/dataCenter/const'

interface Params {
  options: any
  config?: any
}

class Cashier {
  public readonly callback // 业务回调
  constructor (params: Params, callback?: any) {
    this.init(params.options, params.config)
    this.callback = callback
    this.initEvents()
  }
  public init (options: any = {}, config: any = {}) {
    eventBus.setConfig(options, config)
  }
  public show () {
    eventBus.emit(EVENT_ENUM.GET_PAY_INFO)
  }
  public refresh (options: any = {}) {
    eventBus.emit(EVENT_ENUM.CHANGE_PAY_INFO, {
      'change_type': 3,
      ...options
    })
  }
  public pay (params: any = {}) {
    eventBus.emit(EVENT_ENUM.PRE_PAY, params)
  }
  public hide () {
  }
  private initEvents () {
    eventBus.on(EVENT_ENUM.CALLBACK, ({ status, errno, errmsg, from }) => {
      this.callback({ status, errno, errmsg, from })
    })
  }
}

export default Cashier
