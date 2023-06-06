import express from 'express';
import * as authController from './auth.controller';
import { ValidateLoginData, authGuard } from './auth.middleware';

const router = express.Router();

// 用户登录
router.post('/login', ValidateLoginData, authController.login);

// 验证登录
router.post('/auth/validate', authGuard, authController.validate);

export default router;
