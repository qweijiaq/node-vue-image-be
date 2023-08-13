import express from 'express';
import * as diggController from './digg.controller';
import { authGuard } from '../auth/auth.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

// 点赞内容
router.post(
  '/posts/:post_id/digg',
  authGuard,
  accessLog({
    action: '点赞内容',
    resourceType: 'post',
    resourceParamName: 'post_id',
  }),
  diggController.storeUserDiggPost,
);

// 取消点赞
router.delete(
  '/posts/:post_id/digg',
  authGuard,
  accessLog({
    action: '取消点赞',
    resourceType: 'post',
    resourceParamName: 'post_id',
  }),
  diggController.destroyUserDiggPost,
);

// 导出路由
export default router;
