import express from 'express';
import * as avatarController from './avatar.controller';
import { authGuard } from '../auth/auth.middleware';
import { avatarProcessor, avatarInterceptor } from './avatar.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 上传头像
 */
router.post(
  '/avatars',
  authGuard,
  avatarInterceptor,
  avatarProcessor,
  accessLog({
    action: '上传头像',
    resourceType: 'avatar',
  }),
  avatarController.store,
);

/**
 * 头像服务
 */
router.get('/users/:userId/avatar', avatarController.serve);

// 导出路由
export default router;
