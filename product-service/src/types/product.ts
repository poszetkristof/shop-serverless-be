export interface BaseProduct {
  id: string,
  title: string,
  description: string,
  price: number,
}

export interface Product extends BaseProduct {
  count: number,
}

export interface ProductWithoutId extends Omit<Product, 'id'>{}
