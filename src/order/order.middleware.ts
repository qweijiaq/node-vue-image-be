import { Request, Response, NextFunction } from 'express';
import { PaymentName } from '../payment/payment.model';
import { getPostById, PostStatus } from '../post/post.service';
import { getProductById } from '../product/product.service';
import { ProductStatus } from '../product/product.model';
import { OrderStatus } from './order.model';
import { getOrderById } from './order.service';
/**
 * 订单守卫
 */
export const orderGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id: userId },
    body: { payment, productId, resourceType, resourceId },
  } = req;

  try {
    // 检查支付方式
    const isValidPayment = payment in PaymentName;
    if (!isValidPayment) {
      throw new Error('BAD_REQUEST');
    }

    // 检查资源类型
    const isValidResourceType = ['post', 'subscription'].includes(resourceType);
    if (!isValidResourceType) {
      throw new Error('BAD_REQUEST');
    }

    // 检查资源
    if (resourceType === 'post') {
      const post = await getPostById(resourceId, {
        currentUser: { id: userId },
      });
      const isValidPost = post && post.status === PostStatus.published;
      if (!isValidPost) {
        throw new Error('BAD_REQUEST');
      }
    }

    // 检查产品
    const product = await getProductById(productId);
    const isValidProduct =
      product && product.status === ProductStatus.published;
    if (!isValidProduct) {
      throw new Error('BAD_REQUEST');
    }

    // 准备订单数据
    const order = {
      userId,
      status: OrderStatus.pending,
      payment,
      productId,
      totalAmount: product.salePrice,
    };

    // 设置请求主体
    req.body = {
      ...req.body,
      order,
      product,
    };
  } catch (error) {
    return next(error);
  }
  next();
};

/**
 * 更新订单守卫
 */
export const updateOrderGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    params: { orderId },
    body: { payment },
  } = req;

  try {
    // 检查支付方法
    const isValidPayment = payment && payment in PaymentName;
    if (!isValidPayment) {
      throw new Error('BAD_REQUEST');
    }

    // 检查订单
    const order = await getOrderById(parseInt(orderId, 10));
    const isValidOrder =
      order &&
      order.status === OrderStatus.pending &&
      order.payment !== payment;
    if (!isValidOrder) {
      throw new Error('BAD_REQUEST');
    }

    // 设置请求主体
    req.body = {
      dataForUpdate: {
        payment,
      },
      order,
    };
  } catch (error) {
    next(error);
  }

  next();
};

/**
 * 订单支付守卫
 */
export const payOrderGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    params: { orderId },
    user: { id: userId },
  } = req;

  try {
    // 检查订单
    const order = await getOrderById(parseInt(orderId, 10));
    const isValidOrder = order && order.status === OrderStatus.pending;
    if (!isValidOrder) throw new Error('BAD_REQUEST');

    // 检查拥有者
    const isOwner = order.userId === parseInt(userId, 10);
    if (!isOwner) throw new Error('FORBIDDEN');

    // 设置请求
    req.body = { order };
  } catch (error) {
    return next(error);
  }

  next();
};
