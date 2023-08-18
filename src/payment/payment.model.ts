export enum PaymentName {
  wxpay = 'wxpay',
  alipay = 'alipay',
}

export enum PaymentStatus {
  published = 'published',
  draft = 'draft',
  archived = 'archived',
}
export interface PaymentMeta {
  buttonText?: string;
  canOffsite?: boolean;
  color?: string;
}

export class PaymentModel {
  id?: number;
  name?: PaymentName;
  description?: string;
  index?: number;
  meta?: PaymentMeta;
  status?: PaymentStatus;
}
