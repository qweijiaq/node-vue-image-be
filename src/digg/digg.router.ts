import express from 'express';
import * as diggController from './digg.controller';
import { authGuard } from '../auth/auth.middleware';

const router = express.Router();

// 点赞内容
router.post(
  '/posts/:post_id/digg',
  authGuard,
  diggController.storeUserDiggPost,
);

// 取消点赞内容
router.delete(
  '/posts/:post_id/digg',
  authGuard,
  diggController.destroyUserDiggPost,
);

// 导出路由
export default router;
