import express from 'express';
import * as tagControllers from './tag.controller';
import { authGuard } from '../auth/auth.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 创建标签
 */
router.post(
  '/tags',
  authGuard,
  accessLog({
    action: '创建标签',
    resourceType: 'tag',
    payloadParam: 'body.name',
  }),
  tagControllers.store,
);

export default router;
