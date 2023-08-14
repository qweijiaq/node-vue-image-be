import { Request, Response, NextFunction } from 'express';
import { signToken } from '../auth/auth.service';
import { socketServer } from '../app/app.server';
import { updateUserMeta } from '../user-meta/user-meta.service';
import { weixinLoginPostProcess } from './weixin-login.service';

/**
 * 微信登录 用户授权重定向
 */
export const weixinLoginCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  let socketId: any = req.query.state;
  const {
    body: { user, userMeta, weixinUserInfo },
  } = req;

  try {
    // 签发令牌
    const payload = { id: user.id, name: user.name };
    const token = signToken({ payload });

    // 通知客户端登录成功
    socketServer.to(socketId).emit('weixinLoginSucceeded', { user, token });

    // 更新用户 Meta
    await updateUserMeta(userMeta.id, {
      info: JSON.parse(weixinUserInfo),
    });

    // 后期处理
    await weixinLoginPostProcess({ user, weixinUserInfo });

    // 做出响应
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

/**
 * 微信登录 关联本地账户
 */
export const weixinLoginConnect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    user,
    body: { weixinUserInfo },
  } = req;

  try {
    // 签发令牌
    const token = signToken({
      payload: {
        id: user.id,
        name: user.name,
      },
    });

    // 后期处理
    await weixinLoginPostProcess({
      user: user as any,
      weixinUserInfo,
    });

    // 做出响应
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 微信登录 创建并关联本地账户
 */
export const weixinLoginCreateConnect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user,
    body: { weixinUserInfo },
  } = req;

  try {
    // 签发令牌
    const token = signToken({
      payload: {
        id: user.id,
        name: user.name,
      },
    });

    // 后期处理
    await weixinLoginPostProcess({
      user: user as any,
      weixinUserInfo,
    });

    // 做出响应
    res.sendStatus(201).send({ user, token });
  } catch (error) {
    next(error);
  }
};
