import { Request, Response, NextFunction } from 'express';
import {
  getUserMetaByWeixinUnionId,
  createUserMeta,
} from '../user-meta/user-meta.service';
import { getUserById, createUser } from '../user/user.service';
import { socketServer } from '../app/app.server';
import { UserMetaType } from '../user-meta/user-meta.model';
import {
  getWeixinAccessToken,
  getWeixinUserInfo,
} from './weixin-login.service';

/**
 * 微信登录守卫
 */
export const weixinLoginGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  let code: any = req.query.code;
  let socketId: any = req.query.state;

  if (!(code && socketId)) return next(new Error('BAD_REQUEST'));

  try {
    // 微信访问令牌
    const { access_token, openid, unionid } = await getWeixinAccessToken(code);

    // 微信用户信息
    const weixinUserInfo = await getWeixinUserInfo({ access_token, openid });

    // 检查是否绑定
    const userMeta = await getUserMetaByWeixinUnionId(unionid);
    if (userMeta) {
      const user = await getUserById(userMeta.userId);
      req.user = user;
      req.body = {
        user,
        weixinUserInfo,
        userMeta,
      };
    } else {
      // 通知客户端需要绑定账户
      socketServer.to(socketId).emit('weixinLoginConnect', weixinUserInfo);
      return next(new Error('CONNECT_ACCCOUNT_REQUIRED'));
    }
  } catch (error) {
    return next(error);
  }

  next();
};

/**
 * 微信登录关联器
 */
export interface WeiXinLoginConnectorOptions {
  isCreateUserRequired: boolean;
}

export const weixinLoginConnector = (
  options: WeiXinLoginConnectorOptions = { isCreateUserRequired: false },
) => async (req: Request, res: Response, next: NextFunction) => {
  const { isCreateUserRequired } = options;

  // 主体数据
  const { weixinUserInfo } = req.body;

  // 请求用户
  let { user = null } = req;

  try {
    // 检查是否绑定过
    const { unionid } = weixinUserInfo;
    const userMeta = await getUserMetaByWeixinUnionId(unionid);
    if (userMeta) return next(new Error('WEIXIN_ACCOUNT_ALREADY_CONNECTED'));

    // 需要创建新用户
    if (isCreateUserRequired) {
      const { name, password } = req.body;
      const data = await createUser({ name, password });

      // 获取新创建的用户
      user = await getUserById(data.insertId);

      console.log(user.id);

      // 设置请求用户
      req.user = user;
    }

    // 关联账户
    await createUserMeta({
      userId: user.id,
      type: UserMetaType.weixinUserInfo,
      info: JSON.stringify(weixinUserInfo),
    });
  } catch (error) {
    return next(error);
  }

  next();
};
