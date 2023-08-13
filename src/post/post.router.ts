import express from 'express';
import * as postControllers from './post.controller';
// import { requestUrl } from '../app/app.middleware';
import { authGuard, accessControl } from '../auth/auth.middleware';
import {
  sort,
  filter,
  paginate,
  validatePostStatus,
  modelSwitch,
} from './post.middleware';
import { POSTS_PER_PAGE } from '../app/app.config';

const router = express.Router();

// 获取内容列表
router.get(
  '/posts',
  sort,
  filter,
  paginate(POSTS_PER_PAGE),
  validatePostStatus,
  modelSwitch,
  postControllers.index,
);

// 创建内容
router.post('/posts', authGuard, validatePostStatus, postControllers.store);

// 更新内容
router.patch(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  validatePostStatus,
  postControllers.update,
);

// 删除内容
router.delete(
  '/posts/:postId',
  authGuard,
  accessControl({ possession: true }),
  postControllers.destroy,
);

// 添加内容标签
router.post(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postControllers.storePostTag,
);

// 移除内容标签
router.delete(
  '/posts/:postId/tag',
  authGuard,
  accessControl({ possession: true }),
  postControllers.destroyPostTag,
);

// 单个内容
router.get('/posts/:post_id', postControllers.show);

export default router;
