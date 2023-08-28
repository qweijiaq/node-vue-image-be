import express from 'express';
import * as fileController from './file.controller';
import { authGuard } from '../auth/auth.middleware';
import {
  fileInterceptor,
  fileProcessor,
  fileDownloadGuard,
} from './file.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 上传文件
 */
router.post(
  '/files',
  authGuard,
  fileInterceptor,
  fileProcessor,
  accessLog({
    action: '上传文件',
    resourceType: 'file',
  }),
  fileController.store,
);

/**
 * 文件服务
 */
router.get('/files/:fileId/serve', fileController.serve);

/**
 * 文件信息
 */
router.get(
  '/files/:fileId/metadata',
  accessLog({
    action: '文件信息',
    resourceType: 'file',
    resourceParamName: 'fileId',
  }),
  fileController.metadata,
);

/**
 * 文件下载
 */
router.get(
  '/files/:fileId/download',
  fileDownloadGuard,
  fileController.download,
);

export default router;
