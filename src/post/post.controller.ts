import { Request, Response, NextFunction } from 'express';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  postHasTag,
  getPostsTotalCount,
  getPostById,
} from './post.service';
import _ from 'lodash';
import { TagModel } from '../tag/tag.model';
import { getTagByName, createTag } from '../tag/tag.service';
import { createPostTag, deletePostTag } from './post.service';

// 获取内容列表
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 统计内容数量
    const totalCount = await getPostsTotalCount({ filter: req.filter });
    // 设置响应头部
    res.header('X-Total-Count', totalCount);
  } catch (err) {
    next(err);
  }
  try {
    const posts = await getPosts({
      sort: req.sort,
      filter: req.filter,
      pagination: req.pagination,
    });
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

// 添加内容标签
export const storePostTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const { name } = req.body;

  let tag: TagModel;

  try {
    tag = await getTagByName(name);
  } catch (err) {
    next(err);
  }

  // 找到标签，验证内容标签
  if (tag) {
    try {
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);
      if (postTag) return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
    } catch (err) {
      next(err);
    }
  }

  // 如果没有找到该标签
  if (!tag) {
    try {
      const data = await createTag({ name });
      tag = { id: data.insertId };
    } catch (err) {
      return next(err);
    }
  }

  // 给内容打上标签
  try {
    await createPostTag(parseInt(postId, 10), tag.id);
    res.send('添加内容标签成功');
  } catch (err) {
    return next(err);
  }
};

// 移除内容标签
export const destroyPostTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const { tag_id } = req.body;

  try {
    await deletePostTag(parseInt(postId, 10), tag_id);
    res.send('移除内容标签成功');
  } catch (err) {
    next(err);
  }
};

// 单个内容
export const show = async (req: Request, res: Response, next: NextFunction) => {
  // 准备数据
  const { post_id } = req.params;

  // 调取内容
  try {
    const post = await getPostById(parseInt(post_id, 10));

    // 做出响应
    res.send(post);
  } catch (error) {
    next(error);
  }
};
