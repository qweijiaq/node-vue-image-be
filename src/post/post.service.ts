import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';
import { sqlFragment } from './post.provider';
import { currentUser } from '../auth/auth.middleware';
import { TokenPayload } from '../../src/auth/auth.interface';

// 获取内容列表
export interface GetPostsOptionsFilter {
  name: string;
  sql?: string;
  param?: string;
}

export interface GetPostsOptionsPagination {
  limit: number;
  offset: number;
}

interface GetPostsOptions {
  sort?: string;
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
  currentUser?: TokenPayload;
}

export const getPosts = async (options: GetPostsOptions) => {
  const {
    sort,
    filter,
    pagination: { limit, offset },
    currentUser,
  } = options;

  // SQL 参数
  let params: Array<any> = [limit, offset];

  // 设置 SQL 参数
  if (filter.param) {
    params = [filter.param, ...params];
  }

  // 当前用户
  const { id: userId } = currentUser;

  const statement = `
    SELECT
      post.id,
      post.title,
      post.content,
      ${sqlFragment.user},
      ${sqlFragment.totalComments},
      ${sqlFragment.file},
      ${sqlFragment.tags},
      ${sqlFragment.totalDiggs},
      (
        SELECT COUNT(user_digg_post.post_id)
        FROM user_digg_post
        WHERE
          user_digg_post.post_id = post.id
          && user_digg_post.user_id = ${userId}
      ) as digged
      FROM post
      ${sqlFragment.leftJoinUser}
      ${sqlFragment.innerJoinOneFile}
      ${sqlFragment.leftJoinTag}
      ${filter.name == 'userDigged' ? sqlFragment.innerJoinUserDiggPost : ''}
      WHERE ${filter.sql}
      GROUP BY post.id
      ORDER BY ${sort}
      LIMIT ?
      OFFSET ?
    `;
  const [data] = await connection.promise().query(statement, params);
  return data;
};

// 创建内容
export const createPost = async (post: PostModel) => {
  const statement = `
      INSERT INTO post
      SET ?
    `;

  const [data] = await connection.promise().query(statement, post);

  return data;
};

// 更新内容
export const updatePost = async (postId: number, post: PostModel) => {
  const statement = `
      UPDATE post
      SET ?
      WHERE id = ?
    `;

  const [data] = await connection.promise().query(statement, [post, postId]);

  return data;
};

// 删除内容
export const deletePost = async (postId: number) => {
  const statement = `
      DELETE FROM post
      WHERE id = ?
    `;

  const [data] = await connection.promise().query(statement, postId);

  return data;
};

// 保存内容标签
export const createPostTag = async (post_id: number, tag_id: number) => {
  const statement = `
    INSERT INTO post_tag(post_id, tag_id)
    VALUES(?, ?)
  `;

  const [data] = await connection.promise().query(statement, [post_id, tag_id]);

  return data;
};

// 检查内容标签
export const postHasTag = async (post_id: number, tag_id: number) => {
  const statement = `
    SELECT * FROM post_tag
    WHERE post_id = ? AND tag_id = ?
  `;

  const [data] = await connection.promise().query(statement, [post_id, tag_id]);

  return data[0] ? true : false;
};

// 移除内容标签
export const deletePostTag = async (post_id: number, tag_id: number) => {
  const statement = `
    DELETE FROM post_tag
    WHERE post_id = ? AND tag_id = ?
  `;

  const [data] = await connection.promise().query(statement, [post_id, tag_id]);

  return data;
};

// 统计内容数量
export const getPostsTotalCount = async (options: GetPostsOptions) => {
  const { filter } = options;

  // SQL 参数
  let params = [filter.param];

  // 准备查询
  const statement = `
    SELECT
      COUNT(DISTINCT post.id) AS total
    FROM post
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.innerJoinFile}
    ${sqlFragment.leftJoinTag}
    ${filter.name == 'userDigged' ? sqlFragment.innerJoinUserDiggPost : ''}
    WHERE ${filter.sql}
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
  post_id: number,
  options: GetPostByIdOptions = {},
) => {
  const {
    currentUser: { id: user_id },
  } = options;

  // 准备查询
  const statement = `
    SELECT
      post.id,
      post.title,
      post.content,
      ${sqlFragment.user},
      ${sqlFragment.totalComments},
      ${sqlFragment.file},
      ${sqlFragment.tags},
      ${sqlFragment.totalDiggs},
      (
        SELECT COUNT(user_digg_post.post_id)
        FROM user_digg_post
        WHERE
          user_digg_post.post_id = post.id
          && user_digg_post.user_id = ${user_id}
      ) AS digged
    FROM post
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.innerJoinOneFile}
    ${sqlFragment.leftJoinTag}
    WHERE post.id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, post_id);

  // 没找到内容
  if (!data[0].id) {
    throw new Error('NOT_FOUND');
  }

  // 提供数据
  return data[0];
};
