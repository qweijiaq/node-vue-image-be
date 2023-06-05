import express from 'express';
import * as authController from './auth.controller';
import { ValidateLoginData } from './auth.middleware';

const router = express.Router();

// 用户登录
router.post('/login', ValidateLoginData, authController.login);

export default router;
