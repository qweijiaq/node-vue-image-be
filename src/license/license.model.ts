import { ResourceType } from '../app/app.enum';

export enum LicenseState {
  pending = 'pending',
  valid = 'valid',
  invalid = 'invalid',
}

export class LicenseModel {
  id?: number;
  userId?: number;
  orderId?: number;
  resourceType?: ResponseType;
  resourceId?: number;
  status?: LicenseState;
  created?: string;
}
