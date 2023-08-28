import { connection } from '../app/database/mysql';
import { TagModel } from './tag.model';

/**
 * 创建标签
 */
export const createTag = async (tag: TagModel) => {
  const statement = `
      INSERT INTO tag
      SET ?
    `;

  const [data] = await connection.promise().query(statement, tag);

  return data as any;
};

/**
 * 按名字查找标签
 */
export const getTagByName = async (name: string) => {
  const statement = `
      SELECT id, name FROM tag
      WHERE name = ?
    `;

  const [data] = await connection.promise().query(statement, name);

  return data[0];
};
