import { Request, Response, NextFunction } from 'express';
import { SubscriptionModel, SubscriptionType } from './subscription.model';
import {
  getUserValidSubscription,
  getSubscriptionHistory,
} from './subscription.service';
import dayjs from 'dayjs';
import { countDownloads } from '../download/download.service';
import { STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK } from '../app/app.config';

/**
 * 有效订阅
 */
export interface ValidSubscription extends SubscriptionModel {
  isExpired: boolean;
  daysRemaining: number;
  weeklyDownloads: number;
  weeklyDownloadsLimit: number;
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
      const { count } = await countDownloads({
        userId: parseInt(userId),
        type: 'subscription',
        datetime: '7-day',
      });

      validSubscription.weeklyDownloads = count;

      if (subscription.type === SubscriptionType.standard) {
        validSubscription.weeklyDownloadsLimit = STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK;
      } else {
        validSubscription.weeklyDownloadsLimit = null;
      }
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
