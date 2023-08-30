import { Request, Response, NextFunction } from 'express';

/**
 * 默认异常处理器 -- 异常处理器的本质也是中间件，只不过多了错误内容
 */
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
      message = '用户名或密码错误';
      break;
    case 'PASSWORD_DOES_NOT_MATCH':
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
    case 'TAG_ALREADY_EXISTS':
      statusCode = 400;
      message = '该标签已存在';
      break;
    case 'POST_ALREADY_HAS_THIS_TAG':
      statusCode = 400;
      message = '该内容已经包含了该标签';
      break;
    case 'UNABLE_TO_REPLY_THIS_COMMENT':
      statusCode = 400;
      message = '无法回复这条评论';
      break;
    case 'NOT_FOUND':
      statusCode = 404;
      message = '找不到该内容~~ 🦕';
      break;
    case 'USER_NOT_FOUND':
      statusCode = 404;
      message = '找不到该用户~~';
      break;
    case 'PASSWORD_IS_THE_SAME':
      statusCode = 400;
      message = '要修改的密码不能与原密码相同';
      break;
    case 'BAD_REQUEST':
      statusCode = 400;
      message = '无法处理您的请求';
      break;
    case 'FORBIDDEN':
      statusCode = 403;
      message = '没有权限访问';
      break;
    case 'USER_DOES_NOT_OWN_RESOURCE':
      statusCode = 403;
      message = '您无法处理这个请求';
      break;
    case 'CONNECT_ACCCOUNT_REQUIRED':
      statusCode = 403;
      message = '需要关联账户';
      break;
    case 'WEIXIN_ACCOUNT_ALREADY_CONNECTED':
      statusCode = 400;
      message = '您的微信已经绑定了本地应用账户';
      break;
    case 'DOWNLOAD_LIMIT_REACHED':
      statusCode = 400;
      message = '以达下载上限';
      break;
    case 'DOWNLOAD_EXPIRED':
      statusCode = 400;
      message = '下载已过期';
      break;
    case 'DOWNLOAD_INVALID':
      statusCode = 400;
      message = '无效下载令牌';
      break;
    case 'PAYMENT_EXPIRED':
      statusCode = 400;
      message = '支付已过期';
      break;
    default:
      statusCode = 500;
      message = '服务器暂时出了点问题～～';
      break;
  }

  res.status(statusCode).send({ message });
};
