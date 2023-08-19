export enum SubscriptionType {
  standard = 'standard',
  pro = 'pro',
}

export enum SubscriptionStatus {
  pending = 'pending',
  valid = 'valid',
  invalid = 'invalid',
  expired = 'expired',
}

export class SubscriptionModel {
  id?: number;
  userId: number;
  type?: SubscriptionType;
  status?: SubscriptionStatus;
  created?: string;
  expired?: string;
}
