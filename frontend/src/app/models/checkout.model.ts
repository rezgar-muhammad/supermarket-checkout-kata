export interface CheckoutRequest {
  items: Record<string, number>; // { productId: quantity }
}

export interface CheckoutResponse {
  totalPrice: number;
}

// Keep for potential future use
export interface AppliedOffer {
  productName: string;
  savings: number;
}

