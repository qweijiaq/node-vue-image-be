import { Request, Response, NextFunction } from 'express';

/**
 * 支付地址
 */
export const paymentUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { paymentUrl },
  } = req;

  try {
    res.redirect(301, paymentUrl.url);
  } catch (error) {
    next(error);
  }
};
