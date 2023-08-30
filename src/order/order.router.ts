import express from 'express';
import * as orderController from './order.controller';
import { authGuard, accessControl } from '../auth/auth.middleware';
import {
  orderGuard,
  updateOrderGuard,
  payOrderGuard,
} from './order.middleware';
import { accessLog } from '../access-log/access-log.middleware';
import { paginate } from '../post/post.middleware';
import { ORDERS_PER_PAGE } from '../app/app.config';
import { orderIndexFilter, orderLicenseItemGuard } from './order.middleware';

const router = express.Router();

/**
 * 创建订单
 */
router.post(
  '/orders',
  authGuard,
  orderGuard,
  accessLog({
    action: 'createOrder',
    resourceType: 'order',
  }),
  orderController.store,
);

/**
 * 更新订单
 */
router.patch(
  '/orders/:orderId',
  authGuard,
  accessControl({ possession: true }),
  updateOrderGuard,
  accessLog({
    action: 'updateOrder',
    resourceType: 'order',
    resourceParamName: 'orderId',
  }),
  orderController.update,
);

/**
 * 订单支付
 */
router.post(
  '/orders/:orderId/pay',
  authGuard,
  payOrderGuard,
  orderController.pay,
);

/**
 * 订单列表
 */
router.get(
  '/orders',
  authGuard,
  paginate(ORDERS_PER_PAGE),
  accessLog({
    action: 'getOrders',
    resourceType: 'order',
  }),
  orderIndexFilter,
  orderController.index,
);

/**
 * 订单许可项目
 */
router.get(
  '/orders/:orderId/license-item',
  authGuard,
  orderLicenseItemGuard,
  orderController.licenseItem,
);

/**
 * 订单订阅项目
 */
router.get(
  '/orders/:orderId/subscription-item',
  authGuard,
  accessControl({ isAdmin: true }),
  orderController.subscriptionItem,
);

export default router;
