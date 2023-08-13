import { AccessLogModel } from './access-log.model';
import { connection } from '../app/database/mysql';
import { socketServer } from '../app/app.server';

/**
 * 创建访问日志
 */
export const createAccessLog = async (accessLog: AccessLogModel) => {
  // 准备查询
  const statement = `
      INSERT INTO access_log
      SET ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, accessLog);

  // 触发日志已创建的事件
  socketServer.emit('accessLogCreated', accessLog.action);

  // 提供数据
  return data;
};
