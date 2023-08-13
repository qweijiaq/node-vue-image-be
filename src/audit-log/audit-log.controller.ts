import { Request, Response, NextFunction } from 'express';
import { AuditLogStatus } from './audit-log.model';
import {
  creatAuditLog,
  getAuditLogByResource,
  deleteAuditLog,
} from './audit-log.service';

/**
 * 创建审核日志
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await creatAuditLog(req.body);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 取消审核
 */
export const revoke = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { resourceId, resourceType } = req.body;
  const { id: userId } = req.user;

  try {
    const [auditLog] = await getAuditLogByResource({
      resourceType,
      resourceId,
    });
    const canRevokeAudit =
      auditLog &&
      auditLog.status === AuditLogStatus.pending &&
      auditLog.userId === parseInt(userId);

    if (canRevokeAudit) {
      await deleteAuditLog(auditLog.id);
    } else {
      throw new Error('BAD_REQUEST');
    }

    res.send({ message: '成功取消审核' });
  } catch (error) {
    next(error);
  }
};
