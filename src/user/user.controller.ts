import { Request, Response, NextFunction } from 'express';
import { UserModel } from './user.model';
import * as userService from './user.service';
import _ from 'lodash';

// 创建用户
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, password } = req.body;

  try {
    const data = await userService.createUser({ name, password });
    res.send(data);
  } catch (err) {
    next(err);
  }
};

/**
 * 用户帐户
 */
export const show = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { userId } = request.params;

  // 调取用户
  try {
    const user = await userService.getUserById(parseInt(userId, 10));

    if (!user) {
      return next(new Error('USER_NOT_FOUND'));
    }

    // 做出响应
    response.send(user);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { id } = request.user;
  const userData = _.pick(request.body.update, ['name', 'password']);

  // 更新用户
  try {
    const data = await userService.updateUser(parseInt(id, 10), userData);

    // 做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};
