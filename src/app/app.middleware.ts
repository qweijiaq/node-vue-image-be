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
    case 'NAME_IS_REQUIRED':
      statusCode = 400;
      message = '请输入用户名';
      break;
    case 'PASSWORD_IS_REQUIRED':
      statusCode = 400;
      message = '请输入密码';
      break;
    case 'USER_ALREADY_EXIST':
      statusCode = 409;
      message = '该用户名已被占用';
      break;
    case 'USER_DOES_NOT_EXIST':
      statusCode = 400;
      message = '该用户不存在';
      break;
    case 'PASSWORD_DOST_NOT_MATCH':
      statusCode = 400;
      message = '用户名或密码错误';
      break;
    case 'UNAUTHORIZED':
      statusCode = 401;
      message = '请先登录';
      break;
    case 'USER_DOES_NOT_OWN_RESOURCE':
      statusCode = 403;
      message = '您不具备访问该资源的权限';
      break;
    case 'FILE_NOT_FOUND':
      statusCode = 404;
      message = '您访问的资源不存在';
      break;
    default:
      statusCode = 500;
      message = '服务器暂时出了点问题～～';
      break;
  }

  res.status(statusCode).send({ message });
};
