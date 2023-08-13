import express from 'express';
import * as dashboardController from './dashboard.controller';
import { accessCountsFilter, accessCountsGuard } from './dashboard.middleware';

const router = express.Router();

/**
 * 访问次数列表
 */
router.get(
  '/dashboard/access-counts',
  accessCountsFilter,
  dashboardController.accessCountIndex,
);

/**
 * 按动作分时段的访问次数
 */
router.get(
  '/dashboard/access-counts/:action',
  accessCountsGuard,
  accessCountsFilter,
  dashboardController.accessCountShow,
);

export default router;
