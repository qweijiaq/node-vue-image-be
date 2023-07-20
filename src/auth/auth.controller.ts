import { Request, Response, NextFunction, response } from 'express';
import { signToken } from './auth.service';

// 用户登录
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    user: { id, name },
  } = req.body;

  const payload = { id, name };

  try {
    // 签发令牌
    const token = signToken({ payload });
    // 作出响应
    res.send({ id, name, token });
  } catch (err) {
    next(err);
  }
};

// 验证登录
export const validate = (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(200);
};
