import { connection } from '../app/database/mysql';
import { CommentModel } from './comment.model';

// 创建评论
export const createComment = async (comment: CommentModel) => {
  const statement = `
      INSERT INTO comment
      SET ?
    `;
  const [data] = await connection.promise().query(statement, comment);

  return data;
};

// 检测评论是否是回复评论
export const isReplyComment = async (commentId: number) => {
  // 准备查询语句
  const statement = `
      SELECT parent_id FROM comment
      WHERE id = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, commentId);

  // 返回结果
  return data[0].parent_id ? true : false;
};

// 修改评论
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

// 删除评论
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
