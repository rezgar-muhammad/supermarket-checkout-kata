export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Offer {
  id: string;
  productId: string;
  requiredQuantity: number;
  offerPrice: number;
  active: boolean;
}

