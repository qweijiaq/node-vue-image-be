import { connection } from '../app/database/mysql';
import { ProductModel } from './product.model';
/**
 *  按类型调取产品
 */
export interface GetProductByTypeOptions {
  meta?: {
    subscriptionType: string;
  };
}

export const getProductByType = async (
  type: string,
  options: GetProductByTypeOptions = {},
) => {
  const { meta } = options;

  // 查询参数
  const params = [type];

  // 订阅类型条件
  let andWhereSubscriptionType = '';

  if (meta && meta.subscriptionType) {
    andWhereSubscriptionType = `AND JSON_EXTRACT(product.meta, "$.subscriptionType") = ?`;
    params.push(meta.subscriptionType);
  }

  // 准备查询
  const statement = `
      SELECT
        product.id,
        product.type,
        product.title,
        product.description,
        product.price,
        product.salePrice,
        product.meta
      FROM
        product
      WHERE
        product.type = ?
        AND product.status = "published"
        ${andWhereSubscriptionType}
      ORDER BY id DESC
      LIMIT
        1
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  // 提供数据
  return data[0] as ProductModel;
};

/**
 * 按产品 ID 调取服务
 */

export const getProductById = async (productId: number) => {
  // 准备查询
  const statement = `
    SELECT
      * 
    FROM
      product
    WHERE
      product.id = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, productId);

  // 提供数据
  return data[0] as ProductModel;
};
