/**
 * 版本号对比
 * v1 > v2 return 1
 * v1 < v2 return 2
 * v1 = v2 return 0
 * @param version1
 * @param version2
 */
export const versionThan = (version1: string, version2: string, vSymbol: string): boolean => {
  if (__mpx_mode__ === 'web') {
    const format = (v: string) => {
      return v.split('.').map(n => +n + 100).join('')
    }
    const v1 = Number(format(version1))
    const v2 = Number(format(version2))
    switch (vSymbol) {
      case '>':
        return v1 > v2
      case '=':
        return v1 === v2
      case '<':
        return v1 < v2
      case '>=':
        return v1 >= v2
      case '<=':
        return v1 <= v2
      default:
        return false
    }
  }
  return false
}
/**
 * 函数节流
 * @param fn
 * @param delay
 * @returns
 */
export const throttle = (fn: (...rest: any[]) => any, delay = 300) => {
  let lastExecTime = 0
  return function (this: any, ...args: any[]) {
    const currentTime = Date.now()
    if (currentTime - lastExecTime >= delay) {
      fn.apply(this, args)
      lastExecTime = currentTime
    }
  }
}
/**
 * 将对象形式转换成字符串形式
 * { background: '#ccc', color: '#fff' } => 'color:#fff;background:#ccc;'
 * @param style
 * @returns
 */
export const styleObjectToString = (style: any = {}) => {
  return Object.keys(style).reduce((prev: string, curr: string) => `${curr}:${style[curr]};${prev}`, '')
}

/**
 * 绑定回显触发事件
 * 添加回显监听函数
 *    bindVisibilityChange.addHandler(() => {})
 * 删除回显监听函数 若不传指定函数 则全不清空
 *    bindVisibilityChange.removeHandler(() => {})
 * @param {*} fn
 */
export const bindVisibilityChange = (function () {
  if (__mpx_mode__ === 'web') {
    // 存储事件处理函数的数组
    const handlers: any = []
    let hidden: any, visibilityChange: any
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden'
      visibilityChange = 'visibilitychange'
    } else if (typeof (document as any).msHidden !== 'undefined') {
      hidden = 'msHidden'
      visibilityChange = 'msvisibilitychange'
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
      hidden = 'webkitHidden'
      visibilityChange = 'webkitvisibilitychange'
    }
    // 添加事件处理函数
    const addHandler = (handler: any) => {
      handlers.push(handler)
    }

    // 删除事件处理函数
    const removeHandler = (handler: any) => {
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
      if (!handler) {
        handlers.splice(0, handlers.length)
      }
    }

    // visibilitychange 事件处理函数
    const handleVisibilityChange = () => {
      if ((document as any)[hidden]) {
        // 文档不可见时执行的操作
        for (let i = 0; i < handlers.length; i++) {
          handlers[i]('hidden')
        }
      } else {
        // 文档可见时执行的操作
        for (let j = 0; j < handlers.length; j++) {
          handlers[j]('visible')
        }
      }
    }

    // 添加 visibilitychange 事件监听器
    document.addEventListener(visibilityChange, handleVisibilityChange)

    // 返回一个对象，包含添加和删除事件处理函数的方法
    return {
      addHandler: addHandler,
      removeHandler: removeHandler
    }
  }
})()
