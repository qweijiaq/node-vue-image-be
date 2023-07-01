import { connection } from '../app/database/mysql';

/**
 * 保存用户点赞内容
 */
export const createUserDiggPost = async (user_id: number, post_id: number) => {
  // 准备查询
  const statement = `
      INSERT INTO
        user_digg_post (user_id, post_id)
      VALUES (?, ?)
    `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [user_id, post_id]);

  // 提供数据
  return data;
};

/**
 * 取消用户点赞内容
 */
export const deleteUserDiggPost = async (user_id: number, post_id: number) => {
  // 准备查询
  const statement = `
      DELETE FROM user_digg_post
      WHERE user_id = ? AND post_id = ?
    `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [user_id, post_id]);

  // 提供数据
  return data;
};
