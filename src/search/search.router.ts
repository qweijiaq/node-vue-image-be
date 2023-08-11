import express from 'express';
import * as searchController from './search.controller';

const router = express.Router();

/**
 * 搜索标签
 */
router.get('/search/tags', searchController.tags);

/**
 * 搜索用户
 */
router.get('/search/users', searchController.users);

/**
 * 搜索相机
 */
router.get('/search/cameras', searchController.cameras);

/**
 * 搜索相机
 */
router.get('/search/lens', searchController.lens);

export default router;
