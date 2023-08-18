import { Request, Response, NextFunction } from 'express';
import {
  getUserValidLicense,
  getLicenses,
  getLicensesTotalCount,
} from './license.service';

/**
 * 调取有效许可
 */
export const validLicense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id: userId },
    query: { resourceType, resourceId },
  } = req;

  try {
    const data = await getUserValidLicense(
      parseInt(userId),
      resourceType as string,
      parseInt(resourceId as string),
    );
    // 做出响应
    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 许可列表
 */
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id: userId },
    pagination,
  } = req;

  // 过滤器
  const filters = {
    user: parseInt(userId),
  };

  try {
    const licenses = await getLicenses({
      filters,
      pagination,
    });

    const totalCount = await getLicensesTotalCount({ filters });

    // 设置响应头部
    res.header('X-total-Count', totalCount);

    // 做出响应
    res.send(licenses);
  } catch (error) {
    next(error);
  }
};
