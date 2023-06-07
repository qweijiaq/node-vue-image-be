import { connection } from '../app/database/mysql';
import { PostModel } from './post.model';

// 获取内容列表
export const getPosts = async () => {
  const statement = `
    SELECT
      post.id,
      post.title,
      post.content,
      JSON_OBJECT(
        'id', user.id,
        'name', user.name
      ) as user
      FROM post
      LEFT JOIN user
        ON user.id = post.user_id
    `;
  const [data] = await connection.promise().query(statement);
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
