import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';
import { getPaymentUrlByToken, updatePaymentUrl } from './payment-url.service';
import { DATE_TIME_FORMAT } from '../app/app.config';

/**
 * 支付地址守卫
 */
export const paymentUrlGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    query: { token },
  } = req;

  try {
    // 检查 token
    if (!token) throw new Error('BAD_REQUEST');

    // 检查支付地址是否有效
    const paymentUrl = await getPaymentUrlByToken(token as string);
    const isValidPaymenturl = paymentUrl && !paymentUrl.used;
    if (!isValidPaymenturl) throw new Error('BAD_REQUEST');

    // 检查支付地址是否过期
    const isExpired = dayjs()
      .subtract(2, 'hours')
      .isAfter(paymentUrl.created);
    if (isExpired) throw new Error('PAYMENT_EXPIRED');

    // 更新地址
    await updatePaymentUrl(paymentUrl.id, {
      used: dayjs().format(DATE_TIME_FORMAT),
    });

    // 设置请求体
    req.body = { paymentUrl };
  } catch (error) {
    return next(error);
  }

  next();
};
