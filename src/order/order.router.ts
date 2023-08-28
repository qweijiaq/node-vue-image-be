import express from 'express';
import * as orderController from './order.controller';
import { authGuard, accessControl } from '../auth/auth.middleware';
import {
  orderGuard,
  updateOrderGuard,
  payOrderGuard,
} from './order.middleware';
import { accessLog } from '../access-log/access-log.middleware';

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

export default router;
