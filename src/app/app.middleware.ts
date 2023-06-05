import { Request, Response, NextFunction } from 'express';

// 输出请求地址
export const requestUrl = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url);
  next();
};

// 默认异常处理器
export const defaultErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error.message) {
    console.log('🙅', error.message);
  }

  let statusCode: number, message: string;

  // 处理异常
  switch (error.message) {
    default:
      statusCode = 500;
      message = '服务器暂时出了点问题～～';
      break;
  }

  res.status(statusCode).send({ message });
};
