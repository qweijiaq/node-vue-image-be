import { Request, Response, NextFunction } from 'express';
import { createOrder, updateOrder } from './order.service';
import { createOrderLog } from '../order-log/order-log.service';
import { OrderLogAction } from '../order-log/order-log.model';
import { ProductType } from '../product/product.model';
import { createLicense } from '../license/license.service';
import { LicenseStatus } from '../license/license.model';
import { processSubscription } from '../subscription/subscription.service';
import { PaymentName } from '../payment/payment.model';
import { wxpay } from '../payment/wxpay/wxpay.service';
import { alipay } from '../payment/alipay/alipay.service';

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
    order.id = orderId;
    // 创建订单日志
    await createOrderLog({
      userId: parseInt(userId),
      orderId,
      action: OrderLogAction.orderCreated,
      meta: JSON.stringify({
        ...order,
        resourceType,
        resourceId,
      }),
    });
    // 创建许可
    if (product.type === ProductType.license) {
      await createLicense({
        userId: parseInt(userId),
        orderId,
        status: LicenseStatus.pending,
        resourceType,
        resourceId,
      });
    }
    // 创建订阅
    if (product.type === ProductType.subscription) {
      const result = await processSubscription({
        userId: parseInt(userId),
        order,
        product,
      });

      if (result) {
        await updateOrder(orderId, { totalAmount: result.order.totalAmount });
        // 创建订单日志
        await createOrderLog({
          userId: parseInt(userId),
          orderId,
          action: OrderLogAction.orderUpdated,
          meta: JSON.stringify({
            totalAmount: result.order.totalAmount,
          }),
        });
      }
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
      action: OrderLogAction.orderUpdated,
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

/**
 * 订单支付
 */
export interface PrepayResult {
  codeUrl?: string;
  offsetUrl?: string;
  payment?: PaymentName;
}

export const pay = async (req: Request, res: Response, next: NextFunction) => {
  // 准备数据
  const {
    body: { order },
    user: { id: userId },
  } = req;

  try {
    const data: PrepayResult = {};

    if (order.payment === PaymentName.wxpay) {
      const wxpayResult = await wxpay(order, req);

      data.codeUrl = wxpayResult.codeUrl;
      data.payment = PaymentName.wxpay;

      await createOrderLog({
        userId: parseInt(userId, 10),
        orderId: order.id,
        action: OrderLogAction.orderUpdated,
        meta: JSON.stringify(wxpayResult),
      });
    }

    if (order.payment === PaymentName.alipay) {
      const alipayResult = await alipay(order, req);
      data.codeUrl = alipayResult.paymentUrl;
      data.payment = PaymentName.alipay;
      data.offsetUrl = alipayResult.pagePayRequestUrl;

      await createOrderLog({
        userId: parseInt(userId, 10),
        orderId: order.id,
        action: OrderLogAction.orderUpdated,
        meta: JSON.stringify(alipayResult),
      });
    }

    res.send(order);
  } catch (error) {
    next(error);
  }
};
