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
