import { connection } from '../app/database/mysql';
import { AuditLogModel } from './audit-log.model';

/**
 *  创建审核日志
 */
export const creatAuditLog = async (auditLog: AuditLogModel) => {
  // 准备查询
  const statement = `
      INSERT INTO audit_log
      SET ? 
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, auditLog);

  // 提供数据
  return data;
};

/**
 * 按资源获取审核日志
 */
interface GetAuditLogResourceOptions {
  resourceType: string;
  resourceId: number;
}

export const getAuditLogByResource = async (
  options: GetAuditLogResourceOptions,
) => {
  // 准备数据
  const { resourceType, resourceId } = options;

  // 准备查询
  const statement = `
      SELECT
        *
      FROM
        audit_log
      WHERE
        resourceType = ? AND resourceId = ?
      ORDER BY
        audit_log.id DESC
    `;

  // 执行查询
  const [data] = await connection
    .promise()
    .query(statement, [resourceType, resourceId]);

  // 提供数据
  return data as Array<AuditLogModel>;
};

/**
 * 删除审核日志
 */
export const deleteAuditLog = async (auditLogId: number) => {
  // 准备查询
  const statement = `
      DELETE FROM audit_log
      WHERE id = ?
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement, auditLogId);

  // 提供数据
  return data;
};
