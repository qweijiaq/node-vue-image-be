import { PaymentUrlModel } from './payment-url.model';
import { connection } from '../app/database/mysql';

/**
 * 创建支付地址
 */
export const createPaymentUrl = async (paymentUrl: PaymentUrlModel) => {
  // 准备查询
  const statement = `
      INSERT INTO payment_url
      SET ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, paymentUrl);

  // 提供数据
  return data as any;
};

/**
 * 更新支付地址
 */
export const updatePaymentUrl = async (
  paymentUrlId: number,
  paymentUrl: PaymentUrlModel,
) => {
  // 准备查询
  const statement = `
      UPDATE payment_url
      SET ?
      WHERE payment_url.id = ?
    `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [paymentUrl, paymentUrlId]);

  // 提供数据
  return data as any;
};

/**
 * 按 token 调取支付地址
 */
export const getPaymentUrlByToken = async (token: string) => {
  // 准备查询
  const statement = `
      SELECT
        *
      FROM
        payment_url
      WHERE
        payment_url.token = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, token);

  // 提供数据
  return data[0] as PaymentUrlModel;
};
