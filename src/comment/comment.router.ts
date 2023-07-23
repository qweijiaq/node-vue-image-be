import express from 'express';
import * as commentControllers from './comment.controller';
import { authGuard, accessControl } from '../auth/auth.middleware';
import { filter } from './comment.middleware';
import { paginate } from '../post/post.middleware';
import { COMMENTS_PER_PAGE } from '../app/app.config';

const router = express.Router();

// 发布评论
router.post('/comments', authGuard, commentControllers.store);

// 回复评论
router.post('/comments/:commentId', authGuard, commentControllers.reply);

// 修改评论
router.patch(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  commentControllers.update,
);

// 删除评论
router.delete(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  commentControllers.destroy,
);

// 评论列表
router.get(
  '/comments',
  filter,
  paginate(COMMENTS_PER_PAGE),
  commentControllers.index,
);

/**
 * 回复列表
 */
router.get('/comments/:commentId/replies', commentControllers.indexReplies);

export default router;