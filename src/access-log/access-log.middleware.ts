import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { createAccessLog } from './access-log.service';

/**
 * 访问日志
 */
interface AccessLogOptions {
  action: string;
  resourceType?: string;
  resourceParamName?: string;
  payloadParam?: string;
}

export const accessLog = (options: AccessLogOptions) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 解构选项
  const {
    action,
    resourceType,
    resourceParamName = null,
    payloadParam = null,
  } = options;

  let payload = null;

  if (payloadParam) {
    payload = _.get(req, payloadParam, null);
  }

  //当前用户
  const { id: userId, name: userName } = req.user;

  // 资源 ID
  const resourceId = resourceParamName
    ? parseInt(req.params[resourceParamName])
    : null;

  // 头部数据
  const {
    referer,
    origin,
    'user-agent': agent,
    'access-language': language,
  } = req.headers;

  // 请求
  const {
    ip,
    originalUrl,
    method,
    query,
    params,
    route: { path },
  } = req;

  // 日志数据
  const accessLog = {
    userId: parseInt(userId),
    userName,
    action,
    resourceType,
    resourceId,
    payload,
    ip,
    origin,
    referer,
    agent,
    language,
    originalUrl,
    method,
    query: Object.keys(query).length ? JSON.stringify(query) : null,
    params: Object.keys(params).length ? JSON.stringify(params) : null,
  };

  // 创建日志
  createAccessLog(accessLog);

  next();
};
