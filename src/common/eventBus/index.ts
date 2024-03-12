import Base from './base'
import DataCenter from '../dataCenter/index'
import PayBridge from '../payBridge/index'
import Api from '../api/index'
import RavenEvent from '../raven/event'
import {
  ResponseObj,
  PlainObject,
  BridgeResult,
  WxminiappTransferData,
  PrePayResponseObj
} from '../typeDeclare/index'
import {
  PAYSTATUS,
  RESSUCNO,
  EVENT_ENUM
} from '../dataCenter/const'

class EventBus extends Base {
  private payStatus: number | string = '' // 调用getPayInfo时存储状态，1代表有密 2代表免密 3代表已支付，用于埋点属性
  private bridgeInstance: any = null // bridge实例 用于发起支付操作
  private apiInstance: any = null // API实例 用于调用接口
  constructor () {
    super()
    this.payStatus = ''
    this.bridgeInstance = new PayBridge()
    this.initEventBus()
  }
  /**
   * 设置参数
   * @param options
   * @param config
   */
  public setConfig (options: any = {}, config: any = {}) {
    DataCenter.setConfig(options, config)
    // 需要在设置 config 后再初始化 Api，需要用到 config 内的字段
    this.apiInstance = new Api()
  }
  /**
   * 初始化各个周期的事件
   */
  private initEventBus () {
    this.initGetPayInfoEvent()
    this.initChangePayInfoEvent()
    this.initPrePayEvent()
    this.initGetPayStatusEvent()
  }
  /**
   * 获得收银台展示数据
   */
  private initGetPayInfoEvent () {
    RavenEvent.trackEvent('CASHIER_SW')
    this.on(EVENT_ENUM.GET_PAY_INFO, () => {
      this.apiInstance.getPayInfo().then((res: ResponseObj) => {
        if (+res.errno === RESSUCNO) {
          this.handlePanelData(res.data)
        } else {
          this.throwErr({ errno: +res.errno, errmsg: res.errmsg, code: 1101 })
        }
      }).catch((e: any) => {
        this.catchErr({ code: 1001, msg: e })
      })
    })
  }
  /**
   * 切换支付渠道
   */
  private initChangePayInfoEvent () {
    this.on(EVENT_ENUM.CHANGE_PAY_INFO, (params: PlainObject) => {
      const user_select = params.user_select || DataCenter.get('user_select')
      // 若没有选择过支付渠道 就触发getPayInfo逻辑
      if (!user_select) {
        this.emit(EVENT_ENUM.GET_PAY_INFO)
        return
      }
      DataCenter.set('user_select', user_select)
      this.apiInstance.changePayInfo({
        'pay_channels': DataCenter.get('pay_channels'),
        ...params,
        user_select
      }).then((res: ResponseObj) => {
        if (+res.errno === RESSUCNO) {
          this.handlePanelData(res.data)
        } else {
          this.throwErr({ errno: +res.errno, errmsg: res.errmsg, code: 1102 })
        }
      }).catch((e: any) => {
        this.catchErr({ code: 1002, msg: e })
      })
    })
  }
  /**
   * 处理 getPayInfo、changePayInfo 返回数据，其返回格式相同统一进行操作处理
   */
  private handlePanelData (data: any) {
    // 若未返回支付状态 默认待支付
    this.handlePayStatus(EVENT_ENUM.GET_PAY_INFO, data.pay_status || 1, 10, data)
    DataCenter.set('pay_channels', data.pay_channels.module_data)
    DataCenter.set('_transfer', data._transfer)
    const externalChannels = data.external_channel_list.module_data.display_list
    const externalChannelId = externalChannels.find((item: any) => +item.selected === 1)
    DataCenter.set('external_channel_id', externalChannelId.channel_id)
  }
  /**
   * 发起支付
   */
  private initPrePayEvent () {
    /**
     * params: { order_identifier }
     */
    this.on(EVENT_ENUM.PRE_PAY, (params: any) => {
      // 判断发起支付时是否存在 order_identifier
      const orderIdentifier = params.order_identifier || DataCenter.getBaseParams().order_identifier
      if (!orderIdentifier) {
        // 提示缺少参数
        return
      } else {
        DataCenter.set('order_identifier', orderIdentifier)
      }
      this.emit(EVENT_ENUM.CALLBACK, { status: 'payment' })
      const externalChannelId = DataCenter.get('external_channel_id')
      RavenEvent.setCommonData({ external_channel_id: externalChannelId })
      RavenEvent.trackEvent('PRE_CK', params)
      // 间联支付时，不调用prePay接口，组装数据调用bridge方法.
      if (String(externalChannelId) === '320') {
        this.handleIndirectConnectionPay()
        return
      }
      this.apiInstance.prePay({
        'pay_channels': DataCenter.get('pay_channels'),
        ...params,
      }).then((res: ResponseObj) => {
        if (+res.errno === RESSUCNO) {
          this.handlePrePay(res.data)
        } else {
          this.throwErr({ errno: +res.errno, errmsg: res.errmsg, code: 1103 })
        }
      }).catch((e: any) => {
        this.catchErr({ code: 1003, msg: e })
      })
    })
  }
  /**
   * 间联支付
   */
  private handleIndirectConnectionPay () {
    const orderIdentifier = DataCenter.get('order_identifier')
    const externalChannelId = DataCenter.get('external_channel_id')
    const wxAppid = DataCenter.getBaseParams().wxAppid
    const moduleData: WxminiappTransferData = JSON.parse(DataCenter.get('_transfer').module_data)
    const token: string = DataCenter.getBaseParams().token
    const options = {
      out_trade_id: orderIdentifier,
      token,
      _transfer: moduleData.miniapp_prepay_params
    }
    const config = {
      clientSource: 0,
      isAllowDoPay: true
    }
    this.handlePrePay({
      result_type: 1,
      channel_id: externalChannelId,
      common_params: {
        app_id: wxAppid,
        wxminiapp_url: `${moduleData.wxminiapp_url}?options=${JSON.stringify(options)}&config=${JSON.stringify(config)}`,
        wxminiapp_code: moduleData.wxminiapp_code,
        env: DataCenter.get('config').miniapp_env
      }
    })
  }
  /**
   * 支付流程操作
   * @param params { channel_id, common_params, result_type }
   */
  private handlePrePay (params: PrePayResponseObj) {
    // result_type为1的时候需要拉起支付
    switch (String(params.result_type)) {
      case '1':
        this.bridgeInstance.pay(params, (result: BridgeResult) => {
          if (+result.errno === RESSUCNO) {
            this.emit(EVENT_ENUM.GET_PAY_STATUS, 10)
          } else {
            // 失败或取消
            switch (String(result.errno)) {
              case '1': // 失败
                this.throwErr(result as any)
                break
              case '2': // 取消
                RavenEvent.trackEvent('CANCEL_SW')
                this.emit(EVENT_ENUM.CALLBACK, { status: 'cancel' })
                break
              default: // 手动返回时 或其他状态 轮训3次
                this.emit(EVENT_ENUM.GET_PAY_STATUS, 3)
                break
            }
          }
        })
        break
      case '4':
        this.handlePayStatus(EVENT_ENUM.PRE_PAY, 3, 0)
        break
      default:
        this.emit(EVENT_ENUM.GET_PAY_STATUS, 10)
    }
  }
  /**
   * 查询订单支付状态
   */
  private initGetPayStatusEvent () {
    this.on(EVENT_ENUM.GET_PAY_STATUS, (count: number) => {
      // 循环结束
      if (count <= 0) {
        clearTimeout(this.timer)
        // this.emit('callback', {
        //   status: 'fail',
        //   errno: '1000',
        //   errmsg: '暂时无法获取支付状态, 请稍后重试'
        // })
        return
      }
      const startTime = Date.now()
      this.emit(EVENT_ENUM.CALLBACK, { status: 'query' })
      this.apiInstance.getPayStatus({
        'order_identifier': DataCenter.get('order_identifier')
      }).then((res: ResponseObj) => {
        if (+res.errno === RESSUCNO) {
          const handleFunc = () => {
            const payStatus = res.data.pay_status
            this.handlePayStatus(EVENT_ENUM.GET_PAY_STATUS, payStatus, count - 1)
          }
          this.getActionStatusLoop(startTime, handleFunc)
        } else {
          this.throwErr({ errno: +res.errno, errmsg: res.errmsg, code: 1104 })
        }
      }).catch((e: any) => {
        this.catchErr({ code: 1004, msg: e })
      })
    })
  }
  /**
   * 根据订单状态 分别指定下一步操作
   * @param type 标识是getPayInfo进来还是getPayStatus进来
   * @param payStatus 当前的支付状态
   * @param count 剩余轮训次数
   * @param data getPayInfo接口返回值
   */
  private handlePayStatus (type: string, payStatus: number | string, count: number, data?: any) {
    this.payStatus = payStatus
    switch (+payStatus) {
      case PAYSTATUS.unkown:
        this.emit(EVENT_ENUM.GET_PAY_STATUS, count)
        break
      case PAYSTATUS.waitPay:
        if (type === EVENT_ENUM.GET_PAY_STATUS) {
          // getPayStatus 继续轮训
          this.emit(EVENT_ENUM.GET_PAY_STATUS, count)
        } else {
          this.emit(EVENT_ENUM.GET_PAY_INFO_RES, { data, config: DataCenter.get('config') })
        }
        break
      case PAYSTATUS.freePassPaying:
        // 免密支付中 轮训订单状态
        this.emit(EVENT_ENUM.GET_PAY_STATUS, count)
        break
      case PAYSTATUS.paid:
        // 支付完成 走callback
        RavenEvent.trackEvent('SUC_SW')
        this.emit(EVENT_ENUM.CALLBACK, { status: 'success' })
        break
      case PAYSTATUS.freePayFailed:
        // 免密失败
        break
      case PAYSTATUS.riskClose:
        // 订单被风控
        break
      case PAYSTATUS.close:
        // 订单被关闭
        break
      case PAYSTATUS.freePayUnknown:
        // 免密单生成中
        break
      default:
        break
    }
  }
}

export default new EventBus()
