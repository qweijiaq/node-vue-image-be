/**
 * 支付宝：请求参数
 */
export interface AlipayRequestParams {
  appId: string;
  charset: string;
  signType: string;
  timestamp: string;
  version: string;
  method: string;
  notifyUrl?: string;
  returnUrl?: string;
  bizContent: string;
}

/**
 * 支付宝：支付方法
 */
export enum AlipayMethod {
  page = 'alipay.trade.page.pay',
  wap = 'alipay.trade.wap.pay',
}
