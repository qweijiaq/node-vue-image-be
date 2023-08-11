import { Request, Response, NextFunction, response } from 'express';
import {
  searchTags,
  searchUsers,
  searchCameras,
  searchLens,
} from './search.service';

/**
 * 搜索标签
 */
export const tags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 准备关键词
    const { name } = req.query;
    // 查询标签
    let tags;
    if (typeof name === 'string') {
      tags = await searchTags({ name });
    }
    // 做出响应
    res.send(tags);
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索用户
 */
export const users = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 准备关键词
    const { name } = req.query;
    // 查询标签
    let users;
    if (typeof name === 'string') {
      users = await searchUsers({ name });
    }
    // 做出响应
    res.send(users);
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索相机
 */
export const cameras = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 准备关键词
    const { makeModel } = req.query;
    // 查询标签
    let cameras;
    if (typeof makeModel === 'string') {
      cameras = await searchCameras({ makeModel });
    }
    // 做出响应
    res.send(cameras);
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索镜头
 */
export const lens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 准备关键词
    const { makeModel } = req.query;
    // 查询标签
    let lens;
    if (typeof makeModel === 'string') {
      lens = await searchLens({ makeModel });
    }
    // 做出响应
    res.send(lens);
  } catch (error) {
    next(error);
  }
};
