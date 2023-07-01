import { Request, Response, NextFunction } from 'express';
import { POSTS_PER_PAGE } from '../app/app.config';

// 排序方式
export const sort = async (req: Request, res: Response, next: NextFunction) => {
  // 获取客户端的排序方式
  const { sort } = req.query;

  // 排序用的 SQL
  let sqlSort: string;

  // 设置排序用的 SQL
  switch (sort) {
    case 'earliest':
      sqlSort = 'post.id ASC';
      break;
    case 'latest':
      sqlSort = 'post.id DESC';
      break;
    case 'most_comments':
      sqlSort = 'totalComments DESC ,post.id DESC';
      break;
    default:
      sqlSort = 'post.id DESC';
      break;
  }

  // 在请求中添加排序
  req.sort = sqlSort;

  // 下一步
  next();
};

// 过滤列表
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 解构查询符
  const { tag, user, action } = req.query;

  // 设置默认的过滤
  req.filter = {
    name: 'default',
    sql: 'post.id IS NOT NULL',
  };

  // 按标签名过滤
  if (tag && !user && !action) {
    req.filter = {
      name: 'tagName',
      sql: 'tag.name = ?',
      param: `${tag}`,
    };
  }

  // 过滤出用户发布的内容
  if (user && action == 'published' && !tag) {
    req.filter = {
      name: 'userPublished',
      sql: 'user.id = ?',
      param: `${user}`,
    };
  }

  // 过滤出用户赞过的内容
  if (user && action == 'digged' && !tag) {
    req.filter = {
      name: 'userDigged',
      sql: 'user_digg_post.user_id = ?',
      param: `${user}`,
    };
  }

  // 下一步
  next();
};

// 内容分页
export const paginate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 当前页码
  const { page = 1 } = req.query;

  // 每页内容数量
  const limit = parseInt(POSTS_PER_PAGE, 10) || 30;

  // 计算出偏移量
  const offset = limit * (parseInt(`${page}`, 10) - 1);

  // 设置请求中的分页
  req.pagination = { limit, offset };

  // 下一步
  next();
};
// export const paginate = (itemsPerPage: number) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     // 当前页码
//     const { page = 1 } = req.query;

//     // 每页内容数量
//     const limit = itemsPerPage || 30;

//     // 计算出偏移量
//     const offset = limit * (parseInt(`${page}`, 10) - 1);

//     // 设置请求中的分页
//     req.pagination = { limit, offset };

//     // 下一步
//     next();
//   };
// };
