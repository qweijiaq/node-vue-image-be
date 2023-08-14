export enum ProductType {
  license = 'license',
  subscription = 'subscription',
}

export class ProductModel {
  id?: number;
  userId?: number;
  type?: ProductType;
  title?: string;
  description?: Array<string>;
  price?: number;
  salePrice?: number;
  meta?: any;
  created?: Date;
  updated?: Date;
}
