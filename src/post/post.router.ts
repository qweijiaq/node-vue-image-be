import express from 'express';
import * as postControllers from './post.controller';
import { requestUrl } from '../app/app.middleware';

const router = express.Router();

// 获取内容列表
router.get('/posts', requestUrl, postControllers.index);

export default router;
