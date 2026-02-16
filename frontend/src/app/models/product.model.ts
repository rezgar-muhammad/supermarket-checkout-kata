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
  productId: string;
  requiredQuantity: number;
  discountedPrice: number;
}

