import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';
import { sqlFragment } from './post.provider';
import { TokenPayload } from '../../src/auth/auth.interface';
import { AuditLogStatus } from '../audit-log/audit-log.model';

/**
 * 获取内容列表
 */
export interface GetPostsOptionsFilter {
  name: string;
  sql?: string;
  param?: string;
  params?: Array<string>;
}

export interface GetPostsOptionsPagination {
  limit: number;
  offset: number;
}

export enum PostStatus {
  published = 'published',
  draft = 'draft',
  archived = 'archived',
}

interface GetPostsOptions {
  sort?: string;
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
  currentUser?: TokenPayload;
  status?: PostStatus;
  auditStatus?: AuditLogStatus;
}

export const getPosts = async (options: GetPostsOptions) => {
  const {
    sort,
    filter,
    pagination: { limit, offset },
    currentUser,
    status,
    auditStatus,
  } = options;

  // SQL 参数
  let params: Array<any> = [limit, offset];

  // 设置 SQL 参数
  if (filter.param) {
    params = [filter.param, ...params];
  }

  if (filter.params) {
    params = [...filter.params, ...params];
  }

  // 当前用户
  const { id: userId } = currentUser;

  // 发布状态
  const whereStatus = status
    ? `post.status = '${status}'`
    : 'post.status IS NOT NULL';

  // 审核状态
  const whereAuditStatus = auditStatus
    ? `AND audit.status='${auditStatus}'`
    : '';

  const statement = `
    SELECT
      post.id,
      post.title,
      post.content,
      post.status,
      ${sqlFragment.user},
      ${sqlFragment.totalComments},
      ${sqlFragment.file},
      ${sqlFragment.tags},
      ${sqlFragment.totalDiggs},
      ${sqlFragment.audit},
      (
        SELECT COUNT(user_digg_post.postId)
        FROM user_digg_post
        WHERE
          user_digg_post.postId = post.id
          && user_digg_post.userId = ${userId}
      ) as digged
      FROM post
      ${sqlFragment.leftJoinUser}
      ${sqlFragment.innerJoinOneFile}
      ${sqlFragment.leftJoinTag}
      ${sqlFragment.leftJoinOneAuditLog}
      ${filter.name == 'userDigged' ? sqlFragment.innerJoinUserDiggPost : ''}
      WHERE ${filter.sql} AND ${whereStatus} ${whereAuditStatus}
      GROUP BY post.id
      ORDER BY ${sort}
      LIMIT ?
      OFFSET ?
    `;
  const [data] = await connection.promise().query(statement, params);
  return data;
};

/**
 * 创建内容
 */
export const createPost = async (post: PostModel) => {
  const statement = `
      INSERT INTO post
      SET ?
    `;

  const [data] = await connection.promise().query(statement, post);

  return data;
};

/**
 * 更新内容
 */
export const updatePost = async (postId: number, post: PostModel) => {
  const statement = `
      UPDATE post
      SET ?
      WHERE id = ?
    `;

  const [data] = await connection.promise().query(statement, [post, postId]);

  return data;
};

/**
 * 删除内容
 */
export const deletePost = async (postId: number) => {
  const statement = `
      DELETE FROM post
      WHERE id = ?
    `;

  const [data] = await connection.promise().query(statement, postId);

  return data;
};

/**
 * 保存内容标签
 */
export const createPostTag = async (postId: number, tagId: number) => {
  const statement = `
    INSERT INTO post_tag(postId, tagId)
    VALUES(?, ?)
  `;

  const [data] = await connection.promise().query(statement, [postId, tagId]);

  return data;
};

/**
 * 检查内容标签
 */
export const postHasTag = async (postId: number, tagId: number) => {
  const statement = `
    SELECT * FROM post_tag
    WHERE postId = ? AND tagId = ?
  `;

  const [data] = await connection.promise().query(statement, [postId, tagId]);

  return data[0] ? true : false;
};

/**
 * 移除内容标签
 */
export const deletePostTag = async (postId: number, tagId: number) => {
  const statement = `
    DELETE FROM post_tag
    WHERE postId = ? AND tagId = ?
  `;

  const [data] = await connection.promise().query(statement, [postId, tagId]);

  return data;
};

/**
 * 统计内容数量
 */
export const getPostsTotalCount = async (options: GetPostsOptions) => {
  const { filter, status, auditStatus } = options;

  // SQL 参数
  let params = [filter.param];

  if (filter.params) {
    params = [...filter.params, ...params];
  }

  // 发布状态
  const whereStatus = status
    ? `post.status = '${status}'`
    : 'post.status IS NOT NULL';

  // 审核状态
  const whereAuditStatus = auditStatus
    ? `AND audit.status='${auditStatus}'`
    : '';

  // 准备查询
  const statement = `
    SELECT
      COUNT(DISTINCT post.id) AS total
    FROM post
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.innerJoinFile}
    ${sqlFragment.leftJoinTag}
    ${sqlFragment.leftJoinOneAuditLog}
    ${filter.name == 'userDigged' ? sqlFragment.innerJoinUserDiggPost : ''}
    WHERE ${filter.sql} AND ${whereStatus} ${whereAuditStatus}
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  // 提供结果
  return data[0].total;
};

/**
 * 按 ID 调取内容
 */
export interface GetPostByIdOptions {
  currentUser?: TokenPayload;
}

export const getPostById = async (
  postId: number,
  options: GetPostByIdOptions = {},
) => {
  const {
    currentUser: { id: userId },
  } = options;

  // 准备查询
  const statement = `
    SELECT
      post.id,
      post.title,
      post.content,
      post.status,
      ${sqlFragment.user},
      ${sqlFragment.totalComments},
      ${sqlFragment.file},
      ${sqlFragment.tags},
      ${sqlFragment.totalDiggs},
      ${sqlFragment.audit},
      (
        SELECT COUNT(user_digg_post.postId)
        FROM user_digg_post
        WHERE
          user_digg_post.postId = post.id
          && user_digg_post.userId = ${userId}
      ) AS digged
    FROM post
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.innerJoinOneFile}
    ${sqlFragment.leftJoinTag}
    ${sqlFragment.leftJoinOneAuditLog}
    WHERE post.id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, postId);

  // 没找到内容
  if (!data[0].id) {
    throw new Error('NOT_FOUND');
  }

  // 提供数据
  return data[0];
};
