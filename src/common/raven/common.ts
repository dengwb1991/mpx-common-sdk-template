import mpx from '@mpxjs/core'
import menu from './menu'

export const commonTrackEvent = function (this: any, eventId: string, attrs: any, trackEnv: string) {
  // 没有初始化 或 没有传入eventId 则不触发埋点事件
  const menus: any = menu.default
  if (!this.init) {
    this.queue.push({ // 将初始化之前的埋点存入队列中，等初始化之后执行
      type: 'trackEvent',
      eventId,
      attrs
    })
    return
  }
  if (!this.data || !eventId || !menus) {
    return
  }
  const eId = menus[eventId]
  if (!eId) {
    return
  }
  let customAttrs = {}
  if (Object.prototype.toString.call(this.data.omegaAttrs) === '[object Object]') {
    customAttrs = this.data.omegaAttrs
  }

  const { system } = mpx.getSystemInfoSync()
  const device_type = /ios/ig.test(system) ? 0 : 1 // 0: iOS、1: 安卓

  const {
    uid,
    app_id,
    wx_app_id,
    scene,
    app_version,
    external_channel_id,
    errno,
    errmsg,
    code,
    msg,
    sdk_version
  } = this.data

  const eventAttrs = {
    uid,
    app_id,
    wx_app_id,
    device_type,
    app_version,
    scene,
    external_channel_id,
    errno,
    errmsg,
    code,
    msg,
    sdk_version,
    time: new Date().getTime(),
    ...attrs,
    ...customAttrs
  }
  if (this.raven) {
    this.raven.trackEvent(eId, eventAttrs)
  }
}
