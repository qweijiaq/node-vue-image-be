import { Request, Response, NextFunction, response } from 'express';
import { signToken } from './auth.service';

/**
 * 用户登录
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id, name },
  } = req.body;

  // JWT token 可以在线解析，因此不要把敏感数据放入 payload，或者对其进行加密
  const payload = { id, name };

  try {
    // 签发令牌
    const token = signToken({ payload });

    // 做出响应
    res.send({ id, name, token });
  } catch (err) {
    next(err);
  }
};

/**
 * 验证登录
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(200);
};
