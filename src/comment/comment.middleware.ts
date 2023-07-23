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
  req.filter = {
    name: 'default',
    sql: 'comment.parent_id IS NULL',
  };

  // 内容的评论
  if (post && !user && !action) {
    req.filter = {
      name: 'postComments',
      sql: 'comment.parent_id IS NULL AND comment.post_id = ?',
      param: `${post}`,
    };
  }

  // 用户的评论
  if (user && action == 'published' && !post) {
    req.filter = {
      name: 'userPublished',
      sql: 'comment.parent_id IS NULL AND comment.user_id = ?',
      param: `${user}`,
    };
  }

  // 用户的回复
  if (user && action == 'replied' && !post) {
    req.filter = {
      name: 'userReplied',
      sql: 'comment.parent_id IS NOT NULL AND comment.user_id = ?',
      param: `${user}`,
    };
  }

  // 下一步
  next();
};