import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { CartComponent } from '../../components/cart/cart.component';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { CheckoutRequest, CheckoutResponse } from '../../models/checkout.model';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ProductListComponent, CartComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent {
  private readonly cartService: CartService = inject(CartService);
  private readonly checkoutService: CheckoutService = inject(CheckoutService);

  public readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly checkoutResult: WritableSignal<CheckoutResponse | null> = signal<CheckoutResponse | null>(null);
  public readonly error: WritableSignal<string | null> = signal<string | null>(null);

  public onCheckout(): void {
    const request: CheckoutRequest = this.cartService.getCheckoutRequest();

    if (Object.keys(request.items).length === 0) {
      this.error.set('Your cart is empty');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.checkoutService.checkout(request).subscribe({
      next: (response: CheckoutResponse) => {
        this.checkoutResult.set(response);
        this.cartService.clearCart();
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Checkout failed:', err);
        this.error.set('Checkout failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  public dismissResult(): void {
    this.checkoutResult.set(null);
  }

  public dismissError(): void {
    this.error.set(null);
  }
}

