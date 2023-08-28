import express from 'express';
import * as diggController from './digg.controller';
import { authGuard } from '../auth/auth.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 点赞内容
 */
router.post(
  '/posts/:postId/digg',
  authGuard,
  accessLog({
    action: 'createUserDiggPost',
    resourceType: 'post',
    resourceParamName: 'postId',
  }),
  diggController.storeUserDiggPost,
);

/**
 * 取消点赞
 */
router.delete(
  '/posts/:postId/digg',
  authGuard,
  accessLog({
    action: '取消点赞',
    resourceType: 'post',
    resourceParamName: 'postId',
  }),
  diggController.destroyUserDiggPost,
);

export default router;
