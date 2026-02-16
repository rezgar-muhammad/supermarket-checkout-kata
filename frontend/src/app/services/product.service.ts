import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, Offer } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  // Mock data for development - replace with actual API calls
  private readonly mockProducts: Product[] = [
    { id: 'apple', name: 'Apple', price: 0.30 },
    { id: 'banana', name: 'Banana', price: 0.50 },
    { id: 'orange', name: 'Orange', price: 0.60 },
    { id: 'milk', name: 'Milk', price: 1.20 },
    { id: 'bread', name: 'Bread', price: 0.80 }
  ];

  private readonly mockOffers: Offer[] = [
    { productId: 'apple', requiredQuantity: 2, discountedPrice: 0.45 },
    { productId: 'banana', requiredQuantity: 3, discountedPrice: 1.20 }
  ];

  getProducts(): Observable<Product[]> {
    // TODO: Replace with actual API call when backend is ready
    // return this.http.get<Product[]>(this.apiUrl);
    return of(this.mockProducts);
  }

  getOffers(): Observable<Offer[]> {
    // TODO: Replace with actual API call when backend is ready
    // return this.http.get<Offer[]>(`${this.apiUrl}/offers`);
    return of(this.mockOffers);
  }
}

