import { Request, Response, NextFunction } from 'express';
import { getPayments } from './payment.service';

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
    // 2. 验证通知数据
    // 3. 处理完成付款
    // 4. 做出响应

    res.send('收到');
  } catch (error) {
    next(error);
  }
};
