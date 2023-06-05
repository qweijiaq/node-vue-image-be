import express from 'express';
import * as userController from './user.controller';
import { ValidateUserData, hashPassword } from './user.middleware';

const router = express.Router();

// 创建用户
router.post('/users', ValidateUserData, hashPassword, userController.store);

export default router;
