export enum ProductType {
  license = 'license',
  subscription = 'subscription',
}

export enum ProductStatus {
  published = 'published',
  draft = 'draft',
  archived = 'archived',
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
  status?: ProductStatus;
  created?: Date;
  updated?: Date;
}
