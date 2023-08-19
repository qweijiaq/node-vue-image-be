import { SubscriptionLogModel } from './subscription-log.model';
import { connection } from '../app/database/mysql';

/**
 * 创建订阅日志
 */
export const createSubscriptionLog = async (
  subscriptionLog: SubscriptionLogModel,
) => {
  // 准备查询
  const statement = `
      INSERT INTO subscription_log
      SET ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, subscriptionLog);

  // 提供数据
  return data as any;
};

/**
 * 按订单 ID 调取订阅日志
 */
export const getSubscriptionLogByOrderId = async (orderId: number) => {
  // 准备查询
  const statement = `
      SELECT
        *
      FROM
        subscription_log
      WHERE
        subscription_log.orderId = ?
      ORDER BY
        subscription_log.id DESC
      lIMIT 1
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, orderId);

  // 提供数据
  return data[0] as SubscriptionLogModel;
};
