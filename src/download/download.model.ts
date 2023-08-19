import { ResourceType } from '../app/app.enum';

export class DownloadModel {
  id?: number;
  userId?: number;
  licenseId?: number;
  resourceType?: ResourceType;
  resourceId?: number;
  created?: string;
  used?: string;
  token?: string;
}
