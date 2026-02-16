export interface CheckoutRequest {
  items: CartItemRequest[];
}

export interface CartItemRequest {
  productId: string;
  quantity: number;
}

export interface CheckoutResponse {
  totalPrice: number;
  appliedOffers?: AppliedOffer[];
}

export interface AppliedOffer {
  productName: string;
  savings: number;
}

