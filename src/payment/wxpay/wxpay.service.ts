import { Request } from 'express';
import queryString from 'querystring';
import crypto from 'crypto';
import {
  WxpayOrder,
  WxpayPaymentResult,
  WxpayPrePayResult,
} from './wxpay.interface';
import {
  APP_NAME,
  WXPAY_API_UNIFIEDORDER,
  WXPAY_APP_ID,
  WXPAY_KEY,
  WXPAY_MCH_ID,
  WXPAY_NOTIFY_URL,
} from '../../app/app.config';
import { OrderModel } from '../../order/order.model';
import { uid, xmlBuilder, httpClient, xmlParser } from '../../app/app.service';

/**
 * 微信支付：签名
 */
export const wxpaySign = (
  data: WxpayOrder | WxpayPaymentResult,
  key: string,
) => {
  // 排序
  const sortedData = Object.keys(data)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = data[key];
      return accumulator;
    }, {});

  // 转换成地址查询符
  const stringData = queryString.stringify(sortedData, null, null, {
    encodeURIComponent: queryString.unescape,
  });

  // 结尾加上密钥
  const stringDatawithKey = `${stringData}&key=${key}`;

  // MD5 后全部大写
  const sign = crypto
    .createHash('md5')
    .update(stringDatawithKey)
    .digest('hex')
    .toUpperCase();

  return sign;
};

/**
 * 微信支付：验证支付结果通知
 */
export const wxpayVerifyPaymentResult = async (
  paymentResult: WxpayPaymentResult,
) => {
  const { sign } = paymentResult;
  delete paymentResult['sign'];

  const selfSign = wxpaySign(paymentResult, WXPAY_KEY);

  const isValidSign = sign === selfSign;

  return isValidSign;
};

/**
 * 微信支付
 */
export const wxpay = async (order: OrderModel, req: Request) => {
  // 公众账号 ID
  const appId = WXPAY_APP_ID;

  // 微信支付商户号
  const mchId = WXPAY_MCH_ID;

  if (!appId && !mchId) {
    return new Error();
  }

  // 订单号
  const outTradeNo = `${uid()}_${order.id}`;

  // 商品 ID
  const productId = order.productId;

  // 商品描述
  const body = `${APP_NAME}#${order.id}`;

  // 订单金额
  const totalFee = Math.round(order.totalAmount * 100);

  // 支付类型（扫码支付）
  const tradeType = 'NATIVE';

  // 通知地址
  const notifyUrl = WXPAY_NOTIFY_URL;

  // 随机字符
  const nonceStr = uid();

  // 附加数据
  const socketId = (req.headers['x-socket-id'] ||
    req.headers['X-Socket-Id']) as string;
  const attach = socketId || 'NULL';

  // 订单
  const wxpayOrder = {
    appId,
    mchId,
    outTradeNo,
    productId,
    body,
    totalFee,
    tradeType,
    notifyUrl,
    nonceStr,
    attach,
  };

  // 签名
  const sign = wxpaySign(wxpayOrder, WXPAY_KEY);

  const wxpayOrderXml = xmlBuilder.buildObject({
    ...wxpayOrder,
    sign,
  });

  // 统一下单
  const response = await httpClient.post(WXPAY_API_UNIFIEDORDER, wxpayOrderXml);
  const { xml: prepayResult } = await xmlParser.parseStringPromise(
    response.data,
  );
  if (prepayResult.returnCode === 'FAIL') {
    throw new Error(prepayResult.returnMsg);
  }

  return prepayResult as WxpayPrePayResult;
};
