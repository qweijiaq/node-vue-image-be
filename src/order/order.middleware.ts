import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { PaymentName } from '../payment/payment.model';
import { getPostById, PostStatus } from '../post/post.service';
import { getProductById } from '../product/product.service';
import { ProductStatus, ProductType } from '../product/product.model';
import { OrderStatus } from './order.model';
import { getOrderById } from './order.service';
import { getLicenseByOrderId } from '../license/license.service';
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

/**
 * 订单列表过滤器
 */
export interface OrderIndexAllowedFilter {
  order?: string;
  user?: string;
  payment?: string;
  status?: OrderStatus;
  owner?: number;
  created?: Array<string>;
  productType?: ProductType;
}

export const orderIndexFilter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 过滤参数
  let filters = _.pick(req.query, [
    'order',
    'user',
    'payment',
    'status',
  ]) as OrderIndexAllowedFilter;

  // 订单日期
  const { created } = req.query;

  if (created) {
    const dates = decodeURI(created as string).split('|');
    filters.created = dates;
  }

  // 当前用户
  const { id: userId } = req.user;
  filters.owner = parseInt(userId, 10);

  // 管理模式
  const { admin, productType } = req.query;
  if (admin === 'true' && parseInt(userId, 10) === 1) {
    delete filters.owner;

    if (productType) {
      filters.productType = productType as ProductType;
    }
  }

  // 过滤条件
  let filterSql = 'order.id IS NOT NULL';

  // SQL 参数
  let params = [];

  Object.entries(filters).map(item => {
    const [type, value] = item;
    let sql = '';

    switch (type) {
      case 'status':
        sql = 'order.status = ?';
        break;
      case 'order':
        sql = 'order.id = ?';
        break;
      case 'user':
        sql = 'user.name LIKE ?';
        break;
      case 'payment':
        sql = 'order.payment = ?';
        break;
      case 'created':
        sql = 'DATE(order.created) between ? AND ?';
        break;
      case 'owner':
        sql = 'post.userId = ?';
        break;
      case 'productType':
        sql = 'product.type = ?';
        break;
    }

    filterSql = `${filterSql} AND ${sql}`;

    if (Array.isArray(value)) {
      params = [...params, ...value];
    } else {
      params = [...params, value];
    }
  });

  req.filters = {
    name: 'orderIndex',
    sql: filterSql,
    params,
  };

  next();
};

/**
 * 订单许可项目守卫
 */
export const orderLicenseItemGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    params: { orderId },
    user: { id: userId },
  } = req;

  if (parseInt(userId, 10) === 1) return next();

  try {
    const license = await getLicenseByOrderId(parseInt(orderId, 10));

    if (!license) {
      throw new Error('BAD_REQUEST');
    }

    const isOwner = userId === license.resource.user.id;

    if (!isOwner) {
      throw new Error('FORBIDDEN');
    }
  } catch (error) {
    next(error);
  }

  next();
};
