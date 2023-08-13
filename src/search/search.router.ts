import express from 'express';
import * as searchController from './search.controller';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 搜索标签
 */
router.get(
  '/search/tags',
  accessLog({
    action: '搜索标签',
    resourceType: 'search',
    payloadParam: 'query.name',
  }),
  searchController.tags,
);

/**
 * 搜索用户
 */
router.get(
  '/search/users',
  accessLog({
    action: '搜索用户',
    resourceType: 'search',
    payloadParam: 'query.name',
  }),
  searchController.users,
);

/**
 * 搜索相机
 */
router.get(
  '/search/cameras',
  accessLog({
    action: '搜索相机',
    resourceType: 'search',
    payloadParam: 'query.name',
  }),
  searchController.cameras,
);

/**
 * 搜索镜头
 */
router.get(
  '/search/lens',
  accessLog({
    action: '搜索镜头',
    resourceType: 'search',
    payloadParam: 'query.name',
  }),
  searchController.lens,
);

export default router;
