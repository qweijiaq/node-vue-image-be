import express from 'express';
import * as fileControllers from './file.controller';
import { authGuard } from '../auth/auth.middleware';
import { fileInterceptor, fileProcessor } from './file.middleware';

const router = express.Router();

// 上传文件
router.post(
  '/files',
  authGuard,
  fileInterceptor,
  fileProcessor,
  fileControllers.store,
);

// 文件服务
router.get('/files/:fileId/serve', fileControllers.serve);

// 文件信息
router.get('/files/:fileId/metadata', fileControllers.metadata);

export default router;
