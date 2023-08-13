import express from 'express';
import * as commentControllers from './comment.controller';
import { authGuard, accessControl } from '../auth/auth.middleware';
import { filter } from './comment.middleware';
import { paginate } from '../post/post.middleware';
import { COMMENTS_PER_PAGE } from '../app/app.config';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

// 发布评论
router.post(
  '/comments',
  authGuard,
  accessLog({
    action: '发布评论',
    resourceType: 'comment',
    payloadParam: 'body.content',
  }),
  commentControllers.store,
);

// 回复评论
router.post(
  '/comments/:commentId',
  authGuard,
  accessLog({
    action: '回复评论',
    resourceType: 'comment',
    resourceParamName: 'commentId',
    payloadParam: 'body.content',
  }),
  commentControllers.reply,
);

// 修改评论
router.patch(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  accessLog({
    action: '修改评论',
    resourceType: 'comment',
    resourceParamName: 'commentId',
    payloadParam: 'body.content',
  }),
  commentControllers.update,
);

// 删除评论
router.delete(
  '/comments/:commentId',
  authGuard,
  accessControl({ possession: true }),
  accessLog({
    action: '删除评论',
    resourceType: 'comment',
    resourceParamName: 'commentId',
  }),
  commentControllers.destroy,
);

// 评论列表
router.get(
  '/comments',
  filter,
  paginate(COMMENTS_PER_PAGE),
  accessLog({
    action: '评论列表',
    resourceType: 'comment',
  }),
  commentControllers.index,
);

/**
 * 回复列表
 */
router.get(
  '/comments/:commentId/replies',
  accessLog({
    action: '回复列表',
    resourceType: 'comment',
  }),
  commentControllers.indexReplies,
);

export default router;
