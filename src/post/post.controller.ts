import { Request, Response, NextFunction } from 'express';
import { getPosts } from './post.service';

// 获取内容列表
export const index = (req: Request, res: Response, next: NextFunction) => {
  const posts = getPosts();
  res.send(posts);
};
