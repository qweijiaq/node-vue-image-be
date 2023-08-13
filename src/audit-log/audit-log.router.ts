import express from 'express';
import * as auditLogController from './audit-log.controller';
import { authGuard } from '../auth/auth.middleware';
import { auditLogGuard } from './audit-log.middleware';

const router = express.Router();

/**
 * 创建审核日志
 */
router.post('/audit-logs', authGuard, auditLogGuard, auditLogController.store);

/**
 * 取消审核
 */
router.post('/revoke-audit', authGuard, auditLogController.revoke);

export default router;
