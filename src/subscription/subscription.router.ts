import express from 'express';
import { authGuard, accessControl } from '../auth/auth.middleware';
import * as subscriptionController from './subscription.controller';

const router = express.Router();

/**
 * 有效订阅
 */
router.get(
  '/valid-subscription',
  authGuard,
  subscriptionController.validSubscription,
);

/**
 * 订阅历史
 */
router.get(
  '/subscription/:subscriptionId/history',
  authGuard,
  accessControl({ possession: true }),
  subscriptionController.history,
);

export default router;
