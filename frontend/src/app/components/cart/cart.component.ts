import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  readonly items = this.cartService.items;
  readonly itemCount = this.cartService.itemCount;
  readonly subtotal = this.cartService.subtotal;
  readonly totalWithOffers = this.cartService.totalWithOffers;
  readonly savings = this.cartService.savings;

  readonly checkoutRequested = output<void>();

  updateQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.checkoutRequested.emit();
  }

  trackByProductId(_: number, item: CartItem): string {
    return item.product.id;
  }
}

