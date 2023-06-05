import { Request, Response, NextFunction, response } from 'express';

// 用户登录
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, password } = req.body;

  res.send({ message: `欢迎回来，${name}` });
};
