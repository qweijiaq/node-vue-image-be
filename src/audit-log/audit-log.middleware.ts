import { Request, Response, NextFunction } from 'express';
import { AuditLogStatus } from './audit-log.model';
import { possess } from '../auth/auth.service';
import { getAuditLogByResource } from './audit-log.service';

/**
 * 审核日志守卫
 */
export const auditLogGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 准备用户
  const { id: userId, name: userName } = req.user;

  // 准备数据
  const { resourceId, resourceType, note, status } = req.body;

  // 验证资源类型
  const isValidResourceType = ['post', 'comment'].includes(resourceType);

  if (!isValidResourceType) {
    return next(new Error('BAD_REQUEST'));
  }

  // 准备日志数据
  req.body = {
    userId,
    userName,
    resourceType,
    resourceId,
    note,
    status,
  };

  // 管理员
  const isAdmin = userId == '1';

  if (!isAdmin) {
    req.body.status = AuditLogStatus.pending;

    // 检查是否拥有资源
    try {
      const ownResource = await possess({
        resourceId,
        resourceType,
        userId: parseInt(userId, 10),
      });

      if (!ownResource) {
        return next(new Error('USER_DOES_NOT_OWN_RESOURCE'));
      }
    } catch (error) {
      return next(error);
    }
  }

  // 检查审核日志状态是否相同
  try {
    const [auditLog] = await getAuditLogByResource({
      resourceType,
      resourceId,
    });

    const isSameStatus = auditLog && auditLog.status === status;

    if (isSameStatus) {
      return next(new Error('BAD_REQUEST'));
    }
  } catch (error) {
    return next(error);
  }

  next();
};
