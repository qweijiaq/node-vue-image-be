import { OrderLogModel } from './order-log.model';
import { connection } from '../app/database/mysql';
/**
 * 创建订单日志
 */
export const createOrderLog = async (orderLog: OrderLogModel) => {
  // 准备查询
  const statement = `
      INSERT INTO order_log
      SET ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, orderLog);

  // 提供数据
  return data as any;
};
