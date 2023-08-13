import { Resourcetype } from '../app/app.enum';

export enum AuditLogStatus {
  pending = 'pending',
  approved = 'approved',
  denied = 'denied',
}

export class AuditLogModel {
  id?: number;
  userId?: number;
  userName?: string;
  resourceType?: Resourcetype;
  resourceId?: number;
  status?: AuditLogStatus;
  created?: number;
  note?: string;
}
