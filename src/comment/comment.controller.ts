import { Request, Response, NextFunction } from 'express';
import { socketServer } from '../app/app.server';
import {
  createComment,
  deleteComment,
  isReplyComment,
  updateComment,
  getComments,
  getCommentReplies,
  getCommentById,
  getCommentsTotalCount,
} from './comment.service';

/**
 * 发表评论
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: uid } = req.user;
  const { content, postId } = req.body;
  const socketId = req.header('X-Socket-Id');

  const userId = parseInt(uid, 10);

  const comment = {
    content,
    postId,
    userId,
  };

  try {
    // 创建评论
    const data = await createComment(comment);
    // 调取新创建的评论
    const createdComment = await getCommentById(data.insertId);
    // 触发事件
    socketServer.emit('commentCreated', {
      comment: createdComment,
      socketId,
    });
    // 做出响应
    res.status(201).send(data);
  } catch (err) {
    next(err);
  }
};

/**
 * 回复评论
 */
export const reply = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { commentId } = req.params;
  const parentId = parseInt(commentId, 10);
  const { id: uid } = req.user;
  const userId = parseInt(uid, 10);
  const { content, postId } = req.body;
  const socketId = req.header('X-Socket-Id');

  const comment = {
    content,
    postId,
    userId,
    parentId,
  };

  try {
    // 检查评论是否为回复评论
    const reply = await isReplyComment(parentId);
    if (reply) return next(new Error('UNABLE_TO_REPLY_THIS_COMMENT'));
  } catch (error) {
    return next(error);
  }

  try {
    // 回复评论
    const data = await createComment(comment);

    // 回复数据
    const reply = await getCommentById(data.insertId, {
      resourceType: 'reply',
    });

    // 触发事件
    socketServer.emit('commentReplyCreated', {
      reply,
      socketId,
    });

    // 做出响应
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 修改评论
 */
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { commentId } = req.params;
  const { content } = req.body;
  const socketId = req.header('X-Socket-Id');

  const comment = {
    id: parseInt(commentId, 10),
    content,
  };

  try {
    // 修改评论
    const data = await updateComment(comment);

    // 准备资源
    const isReply = await isReplyComment(parseInt(commentId, 10));
    const resourceType = isReply ? 'reply' : 'comment';
    const resource = await getCommentById(parseInt(commentId, 10), {
      resourceType,
    });

    // 触发事件
    const eventName = isReply ? 'commentReplyUpdated' : 'commentUpdated';

    socketServer.emit(eventName, {
      [resourceType]: resource,
      socketId,
    });

    // 做出响应
    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 */
export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { commentId } = req.params;
  const socketId = req.header('X-Socket-Id');

  try {
    // 准备资源
    const isReply = await isReplyComment(parseInt(commentId, 10));
    const resourceType = isReply ? 'reply' : 'comment';
    const resource = await getCommentById(parseInt(commentId, 10), {
      resourceType,
    });

    // 删除评论
    const data = await deleteComment(parseInt(commentId, 10));

    // 触发事件
    const eventName = isReply ? 'commentReplyDeleted' : 'commentDeleted';

    socketServer.emit(eventName, {
      [resourceType]: resource,
      socketId,
    });

    // 做出响应
    res.send(data);
  } catch (error) {
    next(error);
  }
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
