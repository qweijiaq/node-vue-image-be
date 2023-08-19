import { Request, Response, NextFunction } from 'express';
import { SubscriptionModel } from './subscription.model';
import {
  getUserValidSubscription,
  getSubscriptionHistory,
} from './subscription.service';
import dayjs from 'dayjs';

/**
 * 有效订阅
 */
export interface ValidSubscription extends SubscriptionModel {
  isExpired: boolean;
  daysRemaining: number;
}

export const validSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id: userId },
  } = req;

  try {
    const subscription = await getUserValidSubscription(parseInt(userId));
    const validSubscription = subscription
      ? (subscription as ValidSubscription)
      : null;
    if (subscription) {
      validSubscription.isExpired = dayjs().isAfter(subscription.expired);
      validSubscription.daysRemaining = validSubscription.isExpired
        ? 0
        : dayjs(subscription.expired).diff(dayjs(), 'days');
    }

    // 做出响应
    res.send(validSubscription);
  } catch (error) {
    next(error);
  }
};

/**
 * 订阅历史
 */
export const history = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { subscriptionId } = req.params;

  try {
    const history = await getSubscriptionHistory(parseInt(subscriptionId));
    res.send(history);
  } catch (error) {
    next(error);
  }
};
