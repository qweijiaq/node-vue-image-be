export enum UserMetaType {
  weixinUserInfo = 'weixinUserInfo',
}

export class UserMetaModel {
  id?: number;
  userId?: number;
  type?: UserMetaType;
  info?: string;
  created?: number;
  updated?: number;
}
