/**
 * sc.onreadystatechange只在IE下生效，ts编译不通过，就删掉了
 * @param url 需要加载的script url
 */
function loadScript (url: string) {
  function request () {
    return new Promise((resolve: any, reject: any) => {
      const sc = document.createElement('script')
      sc.type = 'text/javascript'
      sc.async = true

      sc.onload = () => {
        resolve()
      }

      sc.onerror = () => {
        reject(new Error('load error'))
        sc.onerror = null
      }

      sc.src = url
      document.getElementsByTagName('head')[0].appendChild(sc)
    })
  }

  function timeout () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 5000)
    })
  }

  return Promise.race([request(), timeout()])
}
export default {
  loadScript,
}
