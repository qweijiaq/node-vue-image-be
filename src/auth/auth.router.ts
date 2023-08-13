import express from 'express';
import * as authController from './auth.controller';
import { ValidateLoginData, authGuard } from './auth.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

// 用户登录
router.post(
  '/login',
  ValidateLoginData,
  accessLog({
    action: '用户登录',
    resourceType: 'auth',
    payloadParam: 'body.name',
  }),
  authController.login,
);

// 验证登录
router.post('/auth/validate', authGuard, authController.validate);

export default router;
