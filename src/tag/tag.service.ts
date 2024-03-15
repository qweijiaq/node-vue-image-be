import { connection } from '../app/database/mysql';
import { TagModel } from './tag.model';

/**
 * 创建标签
 */
export const createTag = async (tag: TagModel) => {
  // 准备查询
  const statement = `
      INSERT INTO tag
      SET ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, tag);

  // 提供数据
  return data as any;
};

/**
 * 按名字查找标签
 */
export const getTagByName = async (name: string) => {
  // 准备查询
  const statement = `
      SELECT id, name FROM tag
      WHERE name = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, name);

  // 提供数据
  return data[0];
};
