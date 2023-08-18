import { Request, Response, NextFunction } from 'express';
import { createOrder, updateOrder } from './order.service';
import { createOrderLog } from '../order-log/order-log.service';
import { OrderLoginAction } from '../order-log/order-log.model';
import { ProductType } from '../product/product.model';
import { createLicense } from '../license/license.service';
import { LicenseState } from '../license/license.model';

/**
 * 创建订单
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id: userId },
    body: { order, resourceType, resourceId, product },
  } = req;

  try {
    // 创建订单
    const data = await createOrder(order);
    const { insertId: orderId } = data;
    // 创建订单日志
    await createOrderLog({
      userId: parseInt(userId),
      orderId,
      action: OrderLoginAction.orderCreated,
      meta: JSON.stringify({
        ...order,
        resourceType,
        resourceId,
      }),
    });
    // 创建许可
    console.log(product.type, ProductType.license);
    if (product.type === ProductType.license) {
      await createLicense({
        userId: parseInt(userId),
        orderId,
        status: LicenseState.pending,
        resourceType,
        resourceId,
      });
    }
    // 做出响应
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新订单
 */
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { dataForUpdate, order },
    user,
  } = req;

  try {
    // 更新订单
    const data = await updateOrder(order.id, dataForUpdate);
    // 创建订单日志
    await createOrderLog({
      userId: parseInt(user.id),
      orderId: order.id,
      action: OrderLoginAction.orderUpdated,
      meta: JSON.stringify({
        ...dataForUpdate,
      }),
    });
    // 做出响应
    res.send(data);
  } catch (error) {
    next(error);
  }
};
