import { Request, Response, NextFunction } from 'express';

/**
 * 过滤器
 */
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 解构查询符
  const { post, user, action } = req.query;

  // 默认的过滤
  req.filters = {
    name: 'default',
    sql: 'comment.parentId IS NULL',
  };

  // 内容的评论
  if (post && !user && !action) {
    req.filters = {
      name: 'postComments',
      sql: 'comment.parentId IS NULL AND comment.postId = ?',
      param: `${post}`,
    };
  }

  // 用户的评论
  if (user && action == 'published' && !post) {
    req.filters = {
      name: 'userPublished',
      sql: 'comment.parentId IS NULL AND comment.userId = ?',
      param: `${user}`,
    };
  }

  // 用户的回复
  if (user && action == 'replied' && !post) {
    req.filters = {
      name: 'userReplied',
      sql: 'comment.parentId IS NOT NULL AND comment.userId = ?',
      param: `${user}`,
    };
  }

  // 下一步
  next();
};
