import { PaymentName } from '../payment/payment.model';

export enum OrderStatus {
  pending = 'pending',
  completed = 'completed',
  archived = 'archived',
}

export class OrderModel {
  id?: number;
  userId?: number;
  productId?: number;
  status?: OrderStatus;
  payment?: PaymentName;
  totalAmount?: number;
  created?: string;
  updated?: string;
}
