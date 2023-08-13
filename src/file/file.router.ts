import express from 'express';
import * as fileControllers from './file.controller';
import { authGuard } from '../auth/auth.middleware';
import { fileInterceptor, fileProcessor } from './file.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

// 上传文件
router.post(
  '/files',
  authGuard,
  fileInterceptor,
  fileProcessor,
  accessLog({
    action: '上传文件',
    resourceType: 'file',
  }),
  fileControllers.store,
);

// 文件服务
router.get('/files/:fileId/serve', fileControllers.serve);

// 文件信息
router.get(
  '/files/:fileId/metadata',
  accessLog({
    action: '文件信息',
    resourceType: 'file',
    resourceParamName: 'fileId',
  }),
  fileControllers.metadata,
);

export default router;
