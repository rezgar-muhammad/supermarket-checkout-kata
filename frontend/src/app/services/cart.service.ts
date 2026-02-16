import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product, Offer } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartItems = signal<CartItem[]>([]);
  private readonly offers = signal<Offer[]>([]);

  // Readonly signals exposed to components
  readonly items = this.cartItems.asReadonly();

  readonly itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  readonly totalWithOffers = computed(() => {
    let total = 0;
    const offers = this.offers();

    for (const item of this.cartItems()) {
      const offer = offers.find(o => o.productId === item.product.id);

      if (offer) {
        const offerSets = Math.floor(item.quantity / offer.requiredQuantity);
        const remainder = item.quantity % offer.requiredQuantity;
        total += (offerSets * offer.discountedPrice) + (remainder * item.product.price);
      } else {
        total += item.product.price * item.quantity;
      }
    }

    return total;
  });

  readonly savings = computed(() => this.subtotal() - this.totalWithOffers());

  setOffers(offers: Offer[]): void {
    this.offers.set(offers);
  }

  addItem(product: Product): void {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);

      if (existingItem) {
        return items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { product, quantity: 1 }];
    });
  }

  removeItem(productId: string): void {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  getCartItemRequest() {
    return this.cartItems().map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));
  }
}

