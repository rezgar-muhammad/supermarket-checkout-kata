import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly products = toSignal(this.productService.getProducts(), { initialValue: [] });
  readonly offers = toSignal(this.productService.getOffers(), { initialValue: [] });

  ngOnInit(): void {
    // Set offers in cart service for discount calculations
    this.productService.getOffers().subscribe(offers => {
      this.cartService.setOffers(offers);
    });
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  getOfferForProduct(productId: string): string | null {
    const offer = this.offers().find(o => o.productId === productId);
    if (offer) {
      return `Buy ${offer.requiredQuantity} for €${offer.offerPrice.toFixed(2)}`;
    }
    return null;
  }

  trackByProductId(_: number, product: Product): string {
    return product.id;
  }
}

