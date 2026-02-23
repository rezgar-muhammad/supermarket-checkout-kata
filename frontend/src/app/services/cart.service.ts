import { Injectable, computed, signal, Signal, WritableSignal } from '@angular/core';
import { CartItem, Product, Offer } from '../models/product.model';
import { CheckoutRequest } from '../models/checkout.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartItems: WritableSignal<CartItem[]> = signal<CartItem[]>([]);
  private readonly offers: WritableSignal<Offer[]> = signal<Offer[]>([]);

  // Readonly signals exposed to components
  public readonly items: Signal<readonly CartItem[]> = this.cartItems.asReadonly();

  public readonly itemCount = computed<number>(() =>
    this.cartItems().reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
  );

  public readonly subtotal = computed<number>(() =>
    this.cartItems().reduce((sum: number, item: CartItem) => sum + (item.product.price * item.quantity), 0)
  );

  public readonly totalWithOffers = computed<number>(() => {
    let total: number = 0;
    const offers: Offer[] = this.offers();

    for (const item of this.cartItems()) {
      const offer: Offer | undefined = offers.find((o: Offer) => o.productId === item.product.id);

      if (offer) {
        const offerSets: number = Math.floor(item.quantity / offer.requiredQuantity);
        const remainder: number = item.quantity % offer.requiredQuantity;
        total += (offerSets * offer.offerPrice) + (remainder * item.product.price);
      } else {
        total += item.product.price * item.quantity;
      }
    }

    return total;
  });

  public readonly savings = computed<number>(() => this.subtotal() - this.totalWithOffers());

  public setOffers(offers: Offer[]): void {
    this.offers.set(offers);
  }

  public addItem(product: Product): void {
    this.cartItems.update((items: CartItem[]) => {
      const existingItem: CartItem | undefined = items.find((item: CartItem) => item.product.id === product.id);

      if (existingItem) {
        return items.map((item: CartItem) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { product, quantity: 1 }];
    });
  }

  public removeItem(productId: string): void {
    this.cartItems.update((items: CartItem[]) =>
      items.filter((item: CartItem) => item.product.id !== productId)
    );
  }

  public updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.cartItems.update((items: CartItem[]) =>
      items.map((item: CartItem) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  public clearCart(): void {
    this.cartItems.set([]);
  }

  public getCheckoutRequest(): CheckoutRequest {
    const items: Record<string, number> = {};
    for (const item of this.cartItems()) {
      items[item.product.id] = item.quantity;
    }
    return { items };
  }
}

