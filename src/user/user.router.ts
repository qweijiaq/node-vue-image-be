import express from 'express';
import * as userController from './user.controller';
import { authGuard } from '../auth/auth.middleware';
import { accessLog } from '../access-log/access-log.middleware';
import {
  ValidateUserData,
  hashPassword,
  validateUpdateUserData,
} from './user.middleware';

const router = express.Router();

/**
 * 创建用户
 */
router.post(
  '/users',
  ValidateUserData,
  hashPassword,
  accessLog({
    action: 'createUser',
    resourceType: 'user',
    payloadParam: 'body.name',
  }),
  userController.store,
);

/**
 * 用户帐户
 */
router.get(
  '/users/:userId',
  accessLog({
    action: '用户帐户',
    resourceType: 'user',
    resourceParamName: 'userId',
  }),
  userController.show,
);

/**
 * 更新用户
 */
router.patch(
  '/users',
  authGuard,
  validateUpdateUserData,
  accessLog({
    action: '更新用户',
    resourceType: 'user',
    payloadParam: 'body.update.name',
  }),
  userController.update,
);

export default router;
