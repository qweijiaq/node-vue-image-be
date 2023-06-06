import { Request, Response, NextFunction } from 'express';
import { getPosts, createPost, updatePost, deletePost } from './post.service';
import _ from 'lodash';

// 获取内容列表
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const posts = await getPosts();
    res.send(posts);
  } catch (err) {
    next(err);
  }
};

// 创建内容
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, content } = req.body;
  const { id } = req.user;
  const user_id = parseInt(id);
  try {
    const data = await createPost({ title, content, user_id });
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

// 更新内容
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const post = _.pick(req.body, ['title', 'content']);

  try {
    const data = await updatePost(parseInt(postId, 10), post);
    res.send(data);
  } catch (err) {
    next(err);
  }
};

// 删除内容
export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  try {
    const data = await deletePost(parseInt(postId, 10));
    res.send(data);
  } catch (err) {
    next(err);
  }
};
