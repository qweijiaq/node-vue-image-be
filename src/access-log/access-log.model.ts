export class AccessLogModel {
  id?: number;
  userId?: number;
  userName?: string;
  action?: string;
  resourceType: string;
  resourceId?: number;
  payload?: string;
  ip?: string;
  origin?: string | string[];
  referer?: string;
  agent?: string;
  language?: string | string[];
  originalUrl?: string;
  method: string;
  query?: Object;
  params: Object;
  created?: number;
}
