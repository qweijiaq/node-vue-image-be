import { Request, Response, NextFunction } from 'express';
import { createUserDiggPost, deleteUserDiggPost } from './digg.service';
import { socketServer } from '../app/app.server';

/**
 * 点赞内容
 */
export const storeUserDiggPost = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { postId } = request.params;
  const { id: uid } = request.user;
  const userId = parseInt(uid, 10);
  const socketId = request.header('X-Socket-Id');

  // 点赞内容
  try {
    const data = await createUserDiggPost(userId, parseInt(postId, 10));

    // 触发事件
    socketServer.emit('userDiggPostCreated', {
      postId: parseInt(postId, 10),
      userId,
      socketId,
    });

    // 做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 取消点赞内容
 */
export const destroyUserDiggPost = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { postId } = request.params;
  const { id: uid } = request.user;
  const userId = parseInt(uid, 10);
  const socketId = request.header('X-Socket-Id');

  // 取消点赞内容
  try {
    const data = await deleteUserDiggPost(userId, parseInt(postId, 10));

    // 触发事件
    socketServer.emit('userDiggPostDeleted', {
      postId: parseInt(postId, 10),
      userId,
      socketId,
    });

    // 做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};
