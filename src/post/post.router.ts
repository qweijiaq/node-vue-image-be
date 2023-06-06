import express from 'express';
import * as postControllers from './post.controller';
import { requestUrl } from '../app/app.middleware';
import { authGuard, accessControl } from '../auth/auth.middleware';

const router = express.Router();

// 获取内容列表
router.get('/posts', requestUrl, postControllers.index);

// 创建内容
router.post('/posts', authGuard, postControllers.store);

// 更新内容
router.patch(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postControllers.update,
);

// 删除内容
router.delete(
  '/posts/:postId',
  accessControl({ possession: true }),
  postControllers.update,
  postControllers.destroy,
);

export default router;
