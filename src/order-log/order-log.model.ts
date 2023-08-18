export enum OrderLoginAction {
  orderCreated = 'orderCreated',
  orderUpdated = 'orderUpdated',
  orderStatusChanged = 'orderStatusChanged',
  orderPaymentRecived = 'orderPaymentRecived',
}

export class OrderLogModel {
  id?: number;
  userId?: number;
  orderId?: number;
  action?: OrderLoginAction;
  meta?: any;
  created?: string;
}
