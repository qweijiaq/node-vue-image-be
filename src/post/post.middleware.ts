import { Request, Response, NextFunction } from 'express';
import { AuditLogStatus } from '../audit-log/audit-log.model';
import { PostStatus } from './post.service';

/**
 * 排序方式
 */
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

/**
 * 过滤列表
 */
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 解构查询符
  const {
    tag,
    user,
    action,
    cameraMake,
    cameraModel,
    lensMake,
    lensModel,
  } = req.query;

  // 设置默认的过滤 -- 主要是用于 WHERE 条件的占位
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
      sql: 'user_digg_post.userId = ?',
      param: `${user}`,
    };
  }

  // 过滤出用某种相机拍摄的内容
  if (cameraMake && cameraModel) {
    req.filter = {
      name: 'camera',
      sql: `file.metadata->'$.Make' = ? AND file.metadata->'$.Model' = ?`,
      params: [`${cameraMake}`, `${cameraModel}`],
    };
  }

  // 过滤出用某种镜头拍摄的内容
  if (lensMake && lensModel) {
    req.filter = {
      name: 'lens',
      sql: `file.metadata->'$.LensMake' = ? AND file.metadata->'$.LensModel' = ?`,
      params: [`${lensMake}`, `${lensModel}`],
    };
  }

  // 下一步
  next();
};

/**
 * 内容分页
 */
export const paginate = (itemsPerPage: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 当前页码
    const { page = 1 } = req.query;

    // 每页内容数量
    const limit = itemsPerPage || 30;

    // 计算出偏移量
    const offset = limit * (parseInt(`${page}`, 10) - 1);

    // 设置请求中的分页
    req.pagination = { limit, offset };

    // 下一步
    next();
  };
};

/**
 * 验证内容状态
 */
export const validatePostStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { status: statusFromQuery } = req.query;
  const { status: statusFromBody = '' } = req.body;

  const status = statusFromQuery || statusFromBody;

  // 检查内容状态是否有效
  const isValidStatus = ['published', 'draft', 'archived', ''].includes(status);

  if (!isValidStatus) {
    next(new Error('BAD_REQUEST'));
  } else {
    next();
  }
};

/**
 * 模式切换器
 */
export const modelSwitch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { manage, admin } = req.query;

  // 管理模式
  const isManageMode = manage === 'true';

  // 管理员模式
  const isAdminMode =
    isManageMode && admin === 'true' && parseInt(req.user.id) === 1;

  if (isManageMode) {
    if (isAdminMode) {
      req.filter = {
        name: 'adminManagePosts',
        sql: 'post.id IS NOT NULL',
        param: '',
      };
    } else {
      req.filter = {
        name: 'userManagePosts',
        sql: 'user.id = ?',
        param: `${req.user.id}`,
      };
    }
  } else {
    // 普通模式
    req.query.status = PostStatus.published;
    req.query.auditStatus = AuditLogStatus.approved;
  }

  next();
};
