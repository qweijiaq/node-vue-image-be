import { Request, Response, NextFunction } from 'express';
import { getPayments, paymentRecived } from './payment.service';
import { xmlParser, xmlBuilder } from '../app/app.service';
import { WxpayPaymentResult } from './wxpay/wxpay.interface';
import { wxpayVerifyPaymentResult } from './wxpay/wxpay.service';

/**
 * 支付方法
 */
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payments = await getPayments();
    res.send(payments);
  } catch (error) {
    next(error);
  }
};

/**
 * 支付结果通知：微信支付
 */
export const wxpayNotify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. 处理通知数据
    // 2. 验证通知数据
    // 3. 处理完成付款
    // 4. 做出响应

    res.send('收到');
  } catch (error) {
    next(error);
  }
};

/**
 * 支付结果通知：支付宝支付
 */
export const alipayNotify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. 处理通知数据
    const data = await xmlParser.parseStringPromise(req.body);
    const paymentResult = data.xml as WxpayPaymentResult;
    const orderId = paymentResult.outTradeNo.split('_')[1];
    // 2. 验证通知数据
    const isValid = await wxpayVerifyPaymentResult(paymentResult);
    // 3. 处理完成付款
    if (isValid) {
      paymentRecived(parseInt(orderId, 10), paymentResult);
    }
    // 4. 做出响应
    const returnCode = isValid ? 'SUCCESS' : 'FAIL';
    const responseData = xmlBuilder.buildObject({
      xml: {
        returnCode,
      },
    });

    res.header({ 'Content-Type': 'text/xml' }).send(responseData);
  } catch (error) {
    next(error);
  }
};
