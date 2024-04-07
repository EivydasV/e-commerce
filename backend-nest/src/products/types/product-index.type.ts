import { DocId } from '../../db/types/doc-id.type';

export interface ProductIndexType {
  title: string;
  _id: DocId;
  description: string;
  categories: Category[];
  manufacturer: string;
  isPublished?: boolean;
  variants?: Variant[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface Category {
  name: string;
}

interface Variant {
  pricing: Pricing;
  quantity: number;
  color: string;
}

interface Pricing {
  cost: number;
  currency: string;
  salePrice: number;
}
