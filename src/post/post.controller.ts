import { Request, Response, NextFunction } from 'express';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  postHasTag,
  getPostsTotalCount,
  getPostById,
  PostStatus,
} from './post.service';
import _ from 'lodash';
import { TagModel } from '../tag/tag.model';
import { getTagByName, createTag } from '../tag/tag.service';
import { createPostTag, deletePostTag } from './post.service';
import { getPostFiles, deletePostFiles } from '../file/file.service';
import { PostModel } from './post.model';
import { getAuditLogByResource } from '../audit-log/audit-log.service';
import { AuditLogStatus } from '../audit-log/audit-log.model';

/**
 * 获取内容列表
 */
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status: any;
  status = req.query.status || '';

  let auditStatus: any;
  auditStatus = req.query.auditStatus;

  try {
    // 统计内容数量
    const totalCount = await getPostsTotalCount({
      filter: req.filters,
      status,
      auditStatus,
    });
    // 设置响应头部
    res.header('X-Total-Count', totalCount);
  } catch (err) {
    next(err);
  }
  try {
    const posts = await getPosts({
      sort: req.sort,
      filter: req.filters,
      pagination: req.pagination,
      currentUser: req.user,
      status,
      auditStatus,
    });
    res.send(posts);
  } catch (err) {
    next(err);
  }
};

/**
 * 创建内容
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, content, status = PostStatus.draft } = req.body;
  const { id } = req.user;
  const userId = parseInt(id, 10);

  const post: PostModel = {
    title,
    content,
    userId,
    status,
  };
  try {
    const data = await createPost(post);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新内容
 */
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  const post = _.pick(req.body, ['title', 'content', 'status']);

  try {
    const data = await updatePost(parseInt(postId, 10), post);
    res.send(data);
  } catch (err) {
    next(err);
  }
};

/**
 * 删除内容
 */
export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId } = req.params;
  try {
    const files = await getPostFiles(parseInt(postId, 10));
    // 删除内容相关的图片文件
    if (files.length) {
      await deletePostFiles(files);
    }
    const data = await deletePost(parseInt(postId, 10));
    res.send(data);
  } catch (err) {
    next(err);
  }
};

/**
 * 添加内容标签
 */
export const storePostTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { postId } = req.params;
  const { name } = req.body;

  let tag: TagModel;

  // 查找标签
  try {
    tag = await getTagByName(name);
  } catch (err) {
    return next(err);
  }

  // 找到标签，验证内容标签
  if (tag) {
    try {
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);
      if (postTag) return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
    } catch (err) {
      return next(err);
    }
  }

  // 如果没有找到该标签，创建标签
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
    res.status(201).send('添加内容标签成功');
  } catch (err) {
    return next(err);
  }
};

/**
 * 移除内容标签
 */
export const destroyPostTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { postId } = req.params;
  const { tagId } = req.body;

  // 移除内容标签
  try {
    await deletePostTag(parseInt(postId, 10), tagId);
    res.status(200).send('移除内容标签成功');
  } catch (err) {
    next(err);
  }
};

/**
 * 单个内容详情
 */
export const show = async (req: Request, res: Response, next: NextFunction) => {
  // 准备数据
  const { postId } = req.params;
  const { user: currentUser } = req;

  // 调取内容
  try {
    const post = await getPostById(parseInt(postId, 10), {
      currentUser,
    });

    // 审核日志
    const [auditLog] = await getAuditLogByResource({
      resourceId: parseInt(postId, 10),
      resourceType: 'post',
    });

    const ownPost = post.user.id === currentUser.id;
    const isAdmin = currentUser.id === '1';
    const isPublished = post.status === PostStatus.published;
    const isApproved = auditLog && auditLog.status === AuditLogStatus.approved;
    const canAccess = isAdmin || ownPost || (isPublished && isApproved);

    if (!canAccess) {
      throw new Error('FORBIDDEN');
    }

    // 做出响应
    res.send(post);
  } catch (error) {
    next(error);
  }
};
