import express from 'express';
import * as tagControllers from './tag.controller';
import { authGuard } from '../auth/auth.middleware';

const router = express.Router();

// 创建标签
router.post('/tags', authGuard, tagControllers.store);

export default router;
