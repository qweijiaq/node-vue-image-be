import { Request, Response, NextFunction } from 'express';
import { getProductByType } from './product.service';

/**
 * 许可产品
 */
export const showLicenseProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const licenseProduct = await getProductByType('license');
    res.send(licenseProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * 订阅产品
 */
export const showSubscriptionProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = [];

    const standardSubscriptionProduct = await getProductByType('subscription', {
      meta: {
        subscriptionType: 'standard',
      },
    });

    if (standardSubscriptionProduct) {
      data.push(standardSubscriptionProduct);
    }

    const proSubscriptionProduct = await getProductByType('subscription', {
      meta: {
        subscriptionType: 'pro',
      },
    });

    if (proSubscriptionProduct) {
      data.push(proSubscriptionProduct);
    }

    res.send(data);
  } catch (error) {
    next(error);
  }
};
