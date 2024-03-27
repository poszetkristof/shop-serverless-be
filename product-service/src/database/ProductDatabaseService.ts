import { Product, ProductWithoutId } from "src/types/product";

export interface ProductDatabaseService {
  find: () => Promise<Product[]>,
  findById: (id: string) => Promise<Product>,
  save: (product: ProductWithoutId) => Promise<Product>,
}
