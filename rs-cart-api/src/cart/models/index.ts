export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};


export type CartItem = {
  product_id: string,
  count: number,
}

export enum STATUS {
  OPEN = 'Open',
  ORDERED = 'Ordered'
}

export type Cart = {
  id: string,
  user_id: string,
  created_at: string,
  updated_at: string,
  status: STATUS,
  items: CartItem[]
}

export type CartQueryResult = {
  id: string,
  user_id: string,
  created_at: string,
  updated_at: string,
  status: STATUS,
  product_id: string,
  count: 1
}