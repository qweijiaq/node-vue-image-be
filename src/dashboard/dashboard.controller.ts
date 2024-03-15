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
  const { filters } = req;

  try {
    const accessCounts = await getAccessCounts({ filters });
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
    filters,
  } = req;

  try {
    const accessCount = await getAccessCountByAction({ action, filters });
    res.send(accessCount);
  } catch (error) {
    next(error);
  }
};
