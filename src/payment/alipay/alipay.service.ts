import { Request } from 'express';
import queryString from 'querystring';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { OrderModel } from '../../order/order.model';
import { AlipayMethod, AlipayRequestParams } from './alipay.interface';
import {
  ALIPAY_APP_ID,
  ALIPAY_APP_PRIVATE_KEY,
  ALIPAY_GATEWAY,
  ALIPAY_NOTIFY_URL,
  ALIPAY_PUBLIC_KEY,
  ALIPAY_RETURN_URL,
  ALIPAY_WAP_PAY_BASE_URL,
  APP_NAME,
  DATE_TIME_FORMAT,
} from '../../app/app.config';
import { uid } from '../../app/app.service';
import { createPaymentUrl } from '../../payment-url/payment-url.service';

/**
 * 支付宝：请求参数
 */
export const alipayRequestParmas = (
  order: OrderModel,
  method: AlipayMethod,
  req: Request,
) => {
  // 应用 ID
  const appId = ALIPAY_APP_ID;
  if (!appId) {
    return new Error();
  }

  // 编码格式
  const charset = 'utf-8';

  // 签名算法
  const signType = 'RSA2';

  // 请求时间
  const timestamp = dayjs().format(DATE_TIME_FORMAT);

  // 接口版本
  const version = '1.0';

  // 通知地址
  const notifyUrl = ALIPAY_NOTIFY_URL;

  // 返回地址
  const returnUrl = ALIPAY_RETURN_URL;

  // 订单号
  const outTradeNo = `${uid()}_${order.id}`;

  // 订单金额
  const totalAmount = order.totalAmount;

  // 商品标题
  const subject = `${APP_NAME}#${order.id}`;

  // 公用回传
  const socketId = (req.headers['x-socket-id'] ||
    req.headers['X-Socket-Id']) as string;
  const passbackParams = socketId || 'NULL';

  // 产品代码
  let productCode: string;

  switch (method) {
    case AlipayMethod.page:
      productCode = 'FAST_INSTANT_TRADE_PAY';
      break;
    case AlipayMethod.wap:
      productCode = 'QUICK_WAP_WAY';
      break;
  }

  // 参数集合
  const bizContent = JSON.stringify({
    outTradeNo,
    totalAmount,
    subject,
    passbackParams,
    productCode,
  });

  // 请求参数
  const requestParams: AlipayRequestParams = {
    appId,
    charset,
    signType,
    timestamp,
    version,
    method,
    notifyUrl,
    returnUrl,
    bizContent,
  };

  return requestParams;
};

/**
 * 支付宝：签名预处理
 */
export const alipayPreSign = (data: AlipayRequestParams) => {
  // 排序
  const sortedData = Object.keys(data)
    .sort()
    .reduce((accumulator, key) => {
      const itemValue = data[key].trim();

      if (!itemValue) return accumulator;

      accumulator[key] = itemValue;
      return accumulator;
    }, {});

  // 查询符
  const dataString = queryString.stringify(sortedData, null, null, {
    encodeURIComponent: queryString.unescape,
  });

  return dataString;
};

/**
 * 支付宝：签名
 */
export const alipaySign = (data: AlipayRequestParams) => {
  const dataString = alipayPreSign(data);

  const sign = crypto
    .createSign('sha256')
    .update(dataString)
    .sign(ALIPAY_APP_PRIVATE_KEY, 'base64');

  return sign;
};

/**
 * 支付宝：支付地址
 */
export const alipayRequestUrl = (
  requestParams: AlipayRequestParams,
  sign: string,
) => {
  const requestParamsString = queryString.stringify({
    ...requestParams,
    sign,
  });

  const requestUrl = `${ALIPAY_GATEWAY}?${requestParamsString}`;

  return requestUrl;
};

/**
 * 支付宝
 */
export const alipay = async (order: OrderModel, req: Request) => {
  // 请求参数
  const pagePayRequestParams = alipayRequestParmas(
    order,
    AlipayMethod.page,
    req,
  );
  const wapPayRequestParams = alipayRequestParmas(order, AlipayMethod.wap, req);

  // 签名
  const pagePaySign = alipaySign(pagePayRequestParams as AlipayRequestParams);
  const wapPaySign = alipaySign(wapPayRequestParams as AlipayRequestParams);

  // 请求地址
  const pagePayRequestUrl = alipayRequestUrl(
    pagePayRequestParams as AlipayRequestParams,
    pagePaySign,
  );
  const wapPayRequestUrl = alipayRequestUrl(
    wapPayRequestParams as AlipayRequestParams,
    wapPaySign,
  );

  // 随机字符
  const token = uid();

  // 支付地址
  await createPaymentUrl({
    orderId: order.id,
    token,
    url: wapPayRequestUrl,
  });

  const paymentUrl = `${ALIPAY_WAP_PAY_BASE_URL}/payment-url?token=${token}`;

  return {
    pagePayRequestUrl,
    paymentUrl,
  };
};

/**
 * 支付宝：验证支付结果
 */
export const alipayVerifyPaymentResult = (data: any) => {
  const { sign } = data;

  delete data.sign;
  delete data.signType;

  const dataString = alipayPreSign(data);

  const result = crypto
    .createVerify('sha256')
    .update(dataString)
    .verify(ALIPAY_PUBLIC_KEY, sign, 'base64');

  return result;
};
