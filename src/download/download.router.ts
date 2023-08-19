import express from 'express';
import * as downloadController from './download.controller';
import { authGuard } from '../auth/auth.middleware';
import { downloadGuard } from './download.middleware';

const router = express.Router();

/**
 * 创建下载
 */
router.post('/downloads', authGuard, downloadGuard, downloadController.store);

export default router;
