import { RequestObj, ResponseObj } from '../../typeDeclare/index'
import mpx from '@mpxjs/core'

const request = (parmas: RequestObj, method: string): Promise<any> => {
  const headers: any = {}
  return new Promise((resolve, reject) => {
    (mpx as any).xfetch.fetch({
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        ...headers
      },
      method,
      ...parmas,
      needSign: true,
    }).then((res: ResponseObj) => {
      if (res.data && res.status === 200) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch((res: ResponseObj) => {
      reject(res)
    })
  })
}

export default {
  get: (params: RequestObj) => {
    return request(params, 'GET')
  },
  post: (params: RequestObj) => {
    return request(params, 'POST')
  }
}
