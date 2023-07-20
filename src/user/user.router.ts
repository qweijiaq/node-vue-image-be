import express from 'express';
import * as userController from './user.controller';
import { authGuard } from '../auth/auth.middleware';
import {
  ValidateUserData,
  hashPassword,
  validateUpdateUserData,
} from './user.middleware';

const router = express.Router();

// 创建用户
router.post('/users', ValidateUserData, hashPassword, userController.store);

/**
 * 用户帐户
 */
router.get('/users/:userId', userController.show);

/**
 * 更新用户
 */
router.patch(
  '/users',
  authGuard,
  validateUpdateUserData,
  userController.update,
);

export default router;
