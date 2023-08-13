import { Request, Response, NextFunction } from 'express';
import { getAccessCounts, getAccessCountByAction } from './dashboard.service';

/**
 * 访问次数列表
 */
export const accessCountIndex = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { filter } = req;

  try {
    const accessCounts = await getAccessCounts({ filter });
    res.send(accessCounts);
  } catch (error) {
    next(error);
  }
};

/**
 * 按动作分时段的访问次数
 */
export const accessCountShow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    params: { action },
    filter,
  } = req;

  try {
    const accessCount = await getAccessCountByAction({ action, filter });
    res.send(accessCount);
  } catch (error) {
    next(error);
  }
};
