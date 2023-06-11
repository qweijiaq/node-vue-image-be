import express from 'express';
import * as commentControllers from './comment.controller';
import { authGuard, accessControl } from '../auth/auth.middleware';

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

export default router;
