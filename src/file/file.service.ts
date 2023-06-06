import { connection } from '../app/database/mysql';
import { FileModel } from './file.model';

// 存储文件信息
export const createFile = async (file: FileModel) => {
  const statement = `
      INSERT INTO file
      SET ?
    `;

  const [data] = await connection.promise().query(statement, file);

  return data;
};

// 按 ID 查找文件
export const findFileById = async (fileId: number) => {
  // 准备查询
  const statement = `
      SELECT * FROM file
      WHERE id = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, fileId);

  return data[0];
};
