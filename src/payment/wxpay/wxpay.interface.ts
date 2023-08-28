/**
 * 微信支付订单
 */
export interface WxpayOrder {
  appId: string;
  mchId: string;
  outTradeNo: string;
  productId: number;
  body: string;
  totalFee: number;
  tradeType: string;
  spbillCreateIp?: string;
  notifyUrl: string;
  nonceStr: string;
  sign?: string;
  attach?: string;
}

/**
 * 微信支付结果通知
 */
export interface WxpayPaymentResult {
  appId: string;
  bankType: string;
  cashFee: number;
  feeType: string;
  isSubscribe: string;
  mchId: string;
  nonceStr: string;
  openid?: string;
  outTradeNo: string;
  resultCode: string;
  returnCode: string;
  sign: string;
  timeEnd: string;
  totalFee: number;
  tradeType: string;
  transactionId: string;
}

/**
 * 微信支付预支付结果
 */
export interface WxpayPrePayResult {
  returnCode: string;
  returnMsg: string;
  appId?: string;
  mchId?: string;
  nonceStr?: string;
  sign?: string;
  resultCode?: string;
  prepayId?: string;
  tradeType?: string;
  codeUrl?: string;
}
