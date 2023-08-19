import { Request, Response, NextFunction } from 'express';
import { getUserValidLicense } from '../license/license.service';
import { getPostById, PostStatus } from '../post/post.service';
import { getUserValidSubscription } from '../subscription/subscription.service';
import dayjs from 'dayjs';
import { SubscriptionType } from '../subscription/subscription.model';
import { countDownloads } from './download.service';
import { STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK } from '../app/app.config';

/**
 * 下载守卫
 */
export const downloadGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { resourceType, resourceId },
    user: { id: userId },
  } = req;

  try {
    // 检查资源
    const resource = await getPostById(resourceId, {
      currentUser: { id: userId },
    });

    const isValidResource =
      resource && resource.status === PostStatus.published;
    if (!isValidResource) throw new Error('BAd_REQUEST');

    // 调取资源许可
    const license = await getUserValidLicense(
      parseInt(userId),
      resourceType,
      resourceId,
    );
    if (license) {
      req.body.license = license;
    }

    // 调取用户订阅
    const subscription = await getUserValidSubscription(parseInt(userId));

    // 有效订阅
    const isValidSubscription =
      subscription && dayjs().isBefore(subscription.expired);

    // 检查用户许可与订阅
    if (!license && !isValidSubscription) throw new Error('FORBIDDEN');

    // 检查标准订阅下载限制
    if (
      isValidSubscription &&
      !license &&
      subscription.type === SubscriptionType.standard
    ) {
      const { count } = await countDownloads({
        userId: parseInt(userId),
        type: 'subscription',
        datetime: '7-day',
      });

      if (count > STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK) {
        throw new Error('DOWNLOAD_LIMIT_REACHED');
      }
    }
  } catch (error) {
    return next(error);
  }

  next();
};
