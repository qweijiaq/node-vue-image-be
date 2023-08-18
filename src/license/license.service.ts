import { LicenseModel } from './license.model';
import { connection } from '../app/database/mysql';
import { sqlFragment as postSqlFragment } from '../post/post.provider';
import { licenseSqlFragment } from './license.provider';

/**
 * 创建许可
 */
export const createLicense = async (license: LicenseModel) => {
  // 准备查询
  const statement = `
     INSERT INTO license
     SET ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, license);

  // 提供数据
  return data as any;
};

/**
 * 更新许可
 */
export const updateLicense = async (
  licenseId: number,
  license: LicenseModel,
) => {
  // 准备查询
  const statement = `
      UPDATE license
      SET ?
      WHERE id = ?
    `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [license, licenseId]);

  // 提供数据
  return data as any;
};

/**
 * 按订单 ID 调取许可
 */
export const getLicenseByOrderId = async (orderId: number) => {
  // 准备查询
  const statement = `
      SELECT
        *
      FROM
        license
      WHERE 
        license.ordetId = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, orderId);

  // 提供数据
  return data[0] as LicenseModel;
};

/**
 * 有效许可证
 */
export const getUserValidLicense = async (
  userId: number,
  resourceType: string,
  resourceId: number,
) => {
  // 准备查询
  const statement = `
      SELECT
        *
      FROM
        license
      WHERE 
        license.status = 'valid'
        AND license.userId = ?
        AND license.resourceType = ?
        AND license.resourceId = ?
      ORDER BY license.id DESC
      LIMIT 1
    `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [userId, resourceType, resourceId]);

  // 提供数据
  return data[0] as LicenseModel;
};

/**
 * 调取许可列表
 */
export interface GetLicensesOptions {
  filters?: { user?: number };
  pagination?: { limit: number; offset: number };
}

export const getLicenses = async (options: GetLicensesOptions) => {
  const {
    filters: { user },
    pagination: { limit, offset },
  } = options;

  // 查询参数
  const params = [user, limit, offset];

  // 准备查询
  const statement = `
    SELECT
      license.id,
      license.created,
      ${postSqlFragment.user},
      ${licenseSqlFragment.order},
      ${licenseSqlFragment.resource},
      ${postSqlFragment.file}
    FROM
      license
    ${licenseSqlFragment.leftJoinLicenseUser}
    ${licenseSqlFragment.leftJoinOrder}
    ${licenseSqlFragment.leftJoinPost}
    ${licenseSqlFragment.leftJoinResourceUser}
    ${postSqlFragment.innerJoinFile}
    WHERE
      license.status = 'valid'
      AND license.userId = ?
    GROUP BY license.id
    ORDER BY license.id DESC
    LIMIT ?
    OFFSET ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  // 提供数据
  return data as any;
};

/**
 * 统计许可
 */
export const getLicensesTotalCount = async (options: GetLicensesOptions) => {
  const {
    filters: { user },
  } = options;

  // 查询参数
  const params = [user];

  // 查询准备
  const statement = `
      SELECT
        COUNT(license.id) AS total
      FROM
        license
      WHERE
        license.status = 'valid'
        AND license.userId = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  // 提供数据
  return data[0].total;
};
