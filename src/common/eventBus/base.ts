import {
  PlainObject,
  Func,
  CatchErrObj,
  throwErrObj
} from '../typeDeclare'
import RavenEvent from '../raven/event'
import {
  LOOPSPACE,
  EVENT_ENUM
} from '../dataCenter/const'
/**
 *  示例：支持先emit 后on
    function callback1(data, data2) {
      console.log(`Callback 1: ${data}`, data2)
    }
    function callback2(data, data2) {
      console.log(`Callback 2: ${data}`, data2)
    }
    eventBus.on('event1', callback1)
    eventBus.on('event1', callback2)
    eventBus.off('event1', callback1)
    eventBus.emit('event1', 'Hello', '2')
 */
export default class Base {
  private _events: PlainObject = {} // 所有绑定事件
  private _queue: PlainObject = {} // 用于存储 还未监听且提前派发的任务，先emit 后on
  public timer: any
  constructor () {
    this.timer = null
  }
  /**
   * 绑定事件
   */
  public on (event: string, callback: Func) {
    if (!this._events[event]) {
      this._events[event] = []
    }
    this._events[event].push(callback)
    this.actionQueue(event, callback)
  }
  /**
   * 同事件绑定一次
   */
  public once (event: string, callback: Func) {
    const wrapper = (...args: any[]) => {
      callback(...args)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }
  /**
   * 不传 callback 时，默认情况当前所有的 event
   */
  public off (event: string, callback: Func) {
    const listenerList = this._events[event]
    if (!listenerList) {
      return true
    }
    if (!callback) {
      this._events[event] = []
    } else {
      this._events[event] = listenerList.filter((cb: Func) => cb !== callback)
    }
  }
  /**
   * 触发已绑定的事件
   */
  public emit (event: string, ...args: any[]) {
    const listenerList = this._events[event]
    if (!listenerList) {
      this.setQueue(event, ...args)
      return true
    }
    /**
     * callback(...args) == callback.apply(null, args)
     */
    this._events[event].forEach((callback: Func) => callback(...args))
  }
  /**
   * 将提前触发(emit)的任务插入队列中，等待被执行，若执行后500毫秒后被销毁
   */
  private setQueue (event: string, ...args: any[]) {
    this._queue[event] = (callback: Func) => {
      callback(...args)
      setTimeout(() => {
        this._queue[event] = null
      }, 500)
    }
  }
  /**
   * 执行队列中的任务
   */
  private actionQueue (event: string, callback: Func) {
    if (this._queue[event]) {
      this._queue[event](callback)
    }
  }
  /**
   * 函数延迟循环
   * 间隔时间最少2秒后执行
   */
  public getActionStatusLoop (startTime: number, handleFunc: any) {
    const endTime = Date.now()
    // 如果接口返回间隔不到2s，就等一会，等到2s在请求下一次
    if (endTime - startTime < LOOPSPACE) {
      const timeDiff = LOOPSPACE - (endTime - startTime)
      this.timer = setTimeout(handleFunc, timeDiff)
    } else {
      handleFunc()
    }
  }
  /**
   * 处理接口请求异常
   * @param params
   */
  public catchErr (params: CatchErrObj) {
    const { code, msg } = params
    const message = typeof msg !== 'string' ? JSON.stringify(msg) : msg
    this.throwErr({
      errno: 1000,
      errmsg: '网络异常，请稍后重试',
      code,
      msg: message
    })
  }
  /**
   * 上报异常、触发异常回调
   * @param params
   */
  public throwErr (params: throwErrObj) {
    if (params.errno === 1000) {
      RavenEvent.trackEvent('REQ_ERR_SW', params)
    } else {
      RavenEvent.trackEvent('ERR_SW', params)
    }
    this.emit(EVENT_ENUM.CALLBACK, {
      status: 'fail',
      ...params
    })
  }
}
