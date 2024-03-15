import { Request, Response, NextFunction } from 'express';
import { allowedAccessCounts } from './dashboard.provider';

/**
 * 访问次数过滤器
 */
export const accessCountsFilter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { dateTimeRange = '1-day' } = req.query;

  const filter = {
    name: 'dateTimeRange',
    sql: null,
    param: null,
  };

  switch (dateTimeRange) {
    case '1-day':
      filter.sql = 'access_log.created > now() - INTERVAL 1 DAY';
      filter.param = '%Y%m%d%H';
      break;
    case '7-day':
      filter.sql = 'access_log.created > now() - INTERVAL 7 DAY';
      filter.param = '%Y%m%d%H';
      break;
    case '1-month':
      filter.sql = 'access_log.created > now() - INTERVAL 1 MONTH';
      filter.param = '%Y%m%d';
      break;
    case '3-month':
      filter.sql = 'access_log.created > now() - INTERVAL 3 MONTH';
      filter.param = '%Y%m%d';
      break;
    default:
      filter.sql = 'access_log.created > now() - INTERVAL 1 DAY';
      filter.param = '%Y%m%d%H';
      break;
  }

  req.filters = filter;

  next();
};

/**
 * 访问次数守卫
 */
export const accessCountsGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { action },
  } = req;

  const allowedAccessCountsActions = allowedAccessCounts.map(
    accessCount => accessCount.action,
  );

  const isAllowedAction = allowedAccessCountsActions.includes(action);

  if (!isAllowedAction) {
    next(new Error('BAD_REQUEST'));
  }

  next();
};
