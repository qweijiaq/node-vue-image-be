import { Request, Response, NextFunction } from 'express';
import {
  createComment,
  deleteComment,
  isReplyComment,
  updateComment,
  getComments,
  getCommentReplies,
} from './comment.service';
import { getCommentsTotalCount } from './comment.service';

// 发表评论
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: uid } = req.user;
  const { content, post_id } = req.body;

  const user_id = parseInt(uid, 10);

  const comment = {
    content,
    post_id,
    user_id,
  };

  try {
    const data = await createComment(comment);
    res.status(201).send(data);
  } catch (err) {
    next(err);
  }
};

// 回复评论
export const reply = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { commentId } = req.params;
  const parent_id = parseInt(commentId, 10);
  const { id: uid } = req.user;
  const user_id = parseInt(uid, 10);
  const { content, post_id } = req.body;

  const comment = {
    content,
    post_id,
    user_id,
    parent_id,
  };

  try {
    // 检查评论是否为回复评论
    const reply = await isReplyComment(parent_id);
    if (reply) return next(new Error('UNABLE_TO_REPLY_THIS_COMMENT'));
  } catch (error) {
    return next(error);
  }

  try {
    // 回复评论
    const data = await createComment(comment);

    // 做出响应
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

// 修改评论
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = {
    id: parseInt(commentId, 10),
    content,
  };

  try {
    // 修改评论
    const data = await updateComment(comment);

    // 做出响应
    res.send(data);
  } catch (error) {
    next(error);
  }
};

// 删除评论
export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { commentId } = req.params;

  try {
    // 删除评论
    const data = await deleteComment(parseInt(commentId, 10));

    // 做出响应
    res.send(data);
  } catch (error) {}
};

/**
 * 评论列表
 */
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 统计评论数量
  try {
    const totalCount = await getCommentsTotalCount({ filter: req.filter });

    // 设置响应头部
    res.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  // 获取评论列表
  try {
    const comments = await getComments({
      filter: req.filter,
      pagination: req.pagination,
    });

    // 做出响应
    res.send(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复列表
 */
export const indexReplies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { commentId } = req.params;

  // 获取评论回复列表
  try {
    const replies = await getCommentReplies({
      commentId: parseInt(commentId, 10),
    });

    // 做出响应
    res.send(replies);
  } catch (error) {
    next(error);
  }
};
