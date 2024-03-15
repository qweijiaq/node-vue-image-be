import { connection } from '../app/database/mysql';
import { CommentModel } from './comment.model';
import { sqlFragment } from './comment.provider';
import {
  GetPostsOptionsFilter,
  GetPostsOptionsPagination,
} from '../../src/post/post.service';

/**
 * 创建评论
 */
export const createComment = async (comment: CommentModel) => {
  // 准备数据
  const statement = `
      INSERT INTO comment
      SET ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, comment);

  // 提供数据
  return data as any;
};

/**
 * 检测评论是否是回复评论
 */
export const isReplyComment = async (commentId: number) => {
  // 准备查询语句
  const statement = `
      SELECT parentId FROM comment
      WHERE id = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, commentId);

  // 返回结果
  return data[0].parentId ? true : false;
};

/**
 * 修改评论
 */
export const updateComment = async (comment: CommentModel) => {
  // 准备数据
  const { id, content } = comment;

  // 准备查询
  const statement = `
      UPDATE comment
      SET content = ?
      WHERE id = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, [content, id]);

  // 提供数据
  return data;
};

/**
 * 删除评论
 */
export const deleteComment = async (commentId: number) => {
  // 准备查询
  const statement = `
      DELETE FROM comment
      WHERE id = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, commentId);

  // 提供数据
  return data;
};

/**
 * 获取评论列表
 */
interface GetCommentsOptions {
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
}

export const getComments = async (options: GetCommentsOptions) => {
  // 解构选项
  const {
    filter,
    pagination: { limit, offset },
  } = options;

  // SQL 参数
  let params: Array<any> = [limit, offset];

  // 设置 SQL 参数
  if (filter.param) {
    params = [filter.param, ...params];
  }

  // 准备查询
  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.user},
      ${sqlFragment.post}
      ${filter.name == 'userReplied' ? `, ${sqlFragment.repliedComment}` : ''}
      ${filter.name !== 'userReplied' ? `, ${sqlFragment.totalReplies}` : ''}
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE
      ${filter.sql}
    GROUP BY
      comment.id
    ORDER BY
      comment.id DESC
    LIMIT ?
    OFFSET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  // 提供数据
  return data;
};

/**
 * 统计评论数量
 */
export const getCommentsTotalCount = async (options: GetCommentsOptions) => {
  // 解构选项
  const { filter } = options;

  // SQL 参数
  let params: Array<any> = [];

  // 设置 SQL 参数
  if (filter.param) {
    params = [filter.param, ...params];
  }

  // 准备查询
  const statement = `
    SELECT
      COUNT(
        DISTINCT comment.id
      ) as total
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE
      ${filter.sql}
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  // 提供结果
  return data[0].total;
};

/**
 * 评论回复列表
 */
interface GetCommentRepliesOptions {
  commentId: number;
}

export const getCommentReplies = async (options: GetCommentRepliesOptions) => {
  // 解构选项
  const { commentId } = options;

  // 准备查询
  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.user}
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    WHERE
      comment.parentId = ?
    GROUP BY
      comment.id
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, commentId);

  // 提供数据
  return data;
};

/**
 * 按 ID 调取评论或回复
 */
interface GetCommentByIdOptions {
  resourceType?: string;
}

export const getCommentById = async (
  commentId: number,
  options: GetCommentByIdOptions = {},
) => {
  const { resourceType = 'comment' } = options;
  const params: Array<any> = [commentId];
  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.user},
      ${sqlFragment.post}
      ${resourceType === 'reply' ? `, ${sqlFragment.repliedComment}` : ''}
      ${resourceType === 'comment' ? `, ${sqlFragment.totalReplies}` : ''}
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}

    WHERE
      comment.id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  return data[0] as any;
};
