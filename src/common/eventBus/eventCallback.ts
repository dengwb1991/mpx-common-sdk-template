import mpx from '@mpxjs/core'
import eventBus from './index'
import { throttle } from '../utils/index'
import { Func } from '../typeDeclare/index'
import {
  EVENT_ENUM
} from '../dataCenter/const'
/**
 * 收银台ready后触发
 */
class EventCallback {
  private initCallback: Func
  constructor () {
    this.initCallback = throttle(this._init, 500)
  }

  private _init () {
    eventBus.on(EVENT_ENUM.CALLBACK, ({ status, errmsg }) => {
      switch (status) {
        case 'cancel':
          mpx.showToast({
            title: '支付取消',
            icon: 'none'
          })
          break
        case 'payment':
          mpx.showLoading({ title: '加载中...', mask: false, duration: 3000 })
          break
        case 'query':
          mpx.showLoading({ title: '支付结果查询中...', mask: false, duration: 3000 })
          break
        case 'fail':
          mpx.showToast({
            title: errmsg || '支付失败',
            icon: 'none',
            duration: 3000
          })
          break
        case 'success':
          mpx.showToast({
            title: errmsg || '支付成功',
            icon: 'none',
            duration: 3000
          })
          break
      }
    })
    eventBus.emit(EVENT_ENUM.CALLBACK, { status: 'init' })
  }

  public init () {
    this.initCallback()
  }
}

export default new EventCallback()
