import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userService from '../user/user.service';
import { PUBLIC_KEY } from '../app/app.config';
import { TokenPayload } from './auth.interface';
import { possess } from './auth.service';

/**
 * 验证用户登录数据
 */
export const ValidateLoginData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, password } = req.body;

  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  const user = await userService.getUserByName(name, { password: true });
  if (!user) return next(new Error('USER_DOES_NOT_EXIST'));

  // 验证用户密码
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return next(new Error('PASSWORD_DOES_NOT_MATCH'));

  // 在请求主体中添加用户
  req.body.user = user;

  // 在请求中添加用户
  req.user = user;

  next();
};

/**
 * 验证用户身份
 */
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.id) {
    next();
  } else {
    next(new Error('UNAUTHORIZED'));
  }
};

/**
 * 当前用户
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let user: TokenPayload = {
    // 未登录的用户
    id: null,
    name: 'anonymous',
  };

  try {
    // 提取 Authorization
    const authorization = req.header('Authorization');

    // 提取 JWT 令牌
    const token = authorization.replace('Bearer ', '');

    if (token) {
      // 验证令牌
      const decoded = jwt.verify(token, PUBLIC_KEY, {
        algorithms: ['RS256'],
      });

      user = decoded as TokenPayload;
    }
  } catch (error) {}

  // 在请求里添加当前用户
  req.user = user;

  next();
};

/**
 * 访问控制
 */
interface AccessControlOptions {
  possession?: boolean;
  isAdmin?: boolean;
}

export const accessControl = (options: AccessControlOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { possession, isAdmin } = options;
    // 当前用户 ID
    const { id: uid } = req.user;
    const userId = parseInt(uid, 10);
    // 放行管理员
    if (userId === 1) return next();
    if (isAdmin) {
      if (userId !== 1) return next(new Error('FORBIDDEN'));
    }
    // 准备资源
    const resourceIdParam = Object.keys(req.params)[0];
    const resourceType = resourceIdParam.replace('Id', '');
    const resourceId = parseInt(req.params[resourceIdParam], 10);
    // 检查资源拥有权
    if (possession) {
      try {
        const ownResource = await possess({
          resourceId,
          resourceType,
          userId,
        });
        if (!ownResource) {
          return next(new Error('USER_DOES_NOT_OWN_RESOURCE'));
        }
      } catch (err) {
        return next(err);
      }
    }

    next();
  };
};
