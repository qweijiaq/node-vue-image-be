import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import _ from 'lodash';
import bcrypt from 'bcrypt';

/**
 * 验证用户
 */
export const ValidateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, password } = req.body;

  if (!name) return next(new Error('NAME_IS_REQUIRED'));
  if (!password) return next(new Error('PASSWORD_IS_REQUIRED'));

  const user = await userService.getUserByName(name);
  if (user) return next(new Error('USER_ALREADY_EXIST'));

  next();
};

/**
 * Hash 密码
 */
export const hashPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password } = req.body;
  req.body.password = await bcrypt.hash(password, 10); // 10 表示 hash 的强度
  next();
};

/**
 * 验证更新用户数据
 */
export const validateUpdateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { validate, update } = req.body;

  // 当前用户
  const { id: userId } = req.user;

  try {
    // 检查用户是否提供了当前密码
    if (!_.has(validate, 'password')) {
      return next(new Error('PASSWORD_IS_REQUIRED'));
    }

    // 调取用户数据
    const user = await userService.getUserById(userId, { password: true });

    // 验证用户密码是否匹配
    const matched = await bcrypt.compare(validate.password, user.password);

    if (!matched) {
      return next(new Error('PASSWORD_DOES_NOT_MATCH'));
    }

    // 检查用户名是否被占用
    if (update.name) {
      const user = await userService.getUserByName(update.name);

      if (user) {
        return next(new Error('USER_ALREADY_EXIST'));
      }
    }

    // 处理用户更新密码
    if (update.password) {
      const matched = await bcrypt.compare(update.password, user.password);

      if (matched) {
        return next(new Error('PASSWORD_IS_THE_SAME'));
      }

      // HASH 用户更新密码
      req.body.update.password = await bcrypt.hash(update.password, 10);
    }
  } catch (error) {
    return next(error);
  }

  // 下一步
  next();
};
