import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { CartComponent } from '../../components/cart/cart.component';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { CheckoutResponse } from '../../models/checkout.model';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ProductListComponent, CartComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent {
  private readonly cartService = inject(CartService);
  private readonly checkoutService = inject(CheckoutService);

  readonly isLoading = signal(false);
  readonly checkoutResult = signal<CheckoutResponse | null>(null);
  readonly error = signal<string | null>(null);

  onCheckout(): void {
    const request = this.cartService.getCheckoutRequest();

    if (Object.keys(request.items).length === 0) {
      this.error.set('Your cart is empty');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.checkoutService.checkout(request).subscribe({
      next: (response) => {
        this.checkoutResult.set(response);
        this.cartService.clearCart();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Checkout failed:', err);
        this.error.set('Checkout failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  dismissResult(): void {
    this.checkoutResult.set(null);
  }

  dismissError(): void {
    this.error.set(null);
  }
}

