import { Component, inject, output, OutputEmitterRef, Signal } from '@angular/core';
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
  private readonly cartService: CartService = inject(CartService);

  public readonly items: Signal<readonly CartItem[]> = this.cartService.items;
  public readonly itemCount: Signal<number> = this.cartService.itemCount;
  public readonly subtotal: Signal<number> = this.cartService.subtotal;
  public readonly totalWithOffers: Signal<number> = this.cartService.totalWithOffers;
  public readonly savings: Signal<number> = this.cartService.savings;

  public readonly checkoutRequested: OutputEmitterRef<void> = output<void>();

  public updateQuantity(productId: string, event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const quantity: number = parseInt(input.value, 10);
    this.cartService.updateQuantity(productId, quantity);
  }

  public removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  public clearCart(): void {
    this.cartService.clearCart();
  }

  public checkout(): void {
    this.checkoutRequested.emit();
  }

  public trackByProductId(_: number, item: CartItem): string {
    return item.product.id;
  }
}

