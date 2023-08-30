export enum UserMetaType {
  weixinUserInfo = 'weixinUserInfo',
}

export class UserMetaModel {
  id?: number;
  userId?: string;
  type?: UserMetaType;
  info?: string;
  created?: number;
  updated?: number;
}
