import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, Offer } from '../../models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private readonly productService: ProductService = inject(ProductService);
  private readonly cartService: CartService = inject(CartService);

  public readonly products: Signal<Product[]> = toSignal(this.productService.getProducts(), { initialValue: [] });
  public readonly offers: Signal<Offer[]> = toSignal(this.productService.getOffers(), { initialValue: [] });

  public ngOnInit(): void {
    // Set offers in cart service for discount calculations
    this.productService.getOffers().subscribe((offers: Offer[]) => {
      this.cartService.setOffers(offers);
    });
  }

  public addToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  public getOfferForProduct(productId: string): string | null {
    const offer: Offer | undefined = this.offers().find((o: Offer) => o.productId === productId);
    if (offer) {
      return `Buy ${offer.requiredQuantity} for €${offer.offerPrice.toFixed(2)}`;
    }
    return null;
  }

  public trackByProductId(_: number, product: Product): string {
    return product.id;
  }
}

