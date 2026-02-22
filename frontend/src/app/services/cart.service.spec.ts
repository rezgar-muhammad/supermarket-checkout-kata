import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product, Offer } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;

  const mockProduct1: Product = {
    id: 'A',
    name: 'Apple',
    price: 1.00
  };

  const mockProduct2: Product = {
    id: 'B',
    name: 'Banana',
    price: 0.50
  };

  const mockOffer: Offer = {
    id: 'offer1',
    productId: 'A',
    requiredQuantity: 3,
    offerPrice: 2.50,
    active: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      service.addItem(mockProduct1);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe('A');
      expect(service.items()[0].quantity).toBe(1);
    });

    it('should increment quantity when adding existing item', () => {
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(3);
    });

    it('should handle multiple different products', () => {
      service.addItem(mockProduct1);
      service.addItem(mockProduct2);

      expect(service.items().length).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      service.addItem(mockProduct1);
      service.addItem(mockProduct2);
      service.removeItem('A');

      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe('B');
    });

    it('should handle removing non-existent item', () => {
      service.addItem(mockProduct1);
      service.removeItem('INVALID');

      expect(service.items().length).toBe(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      service.addItem(mockProduct1);
      service.updateQuantity('A', 5);

      expect(service.items()[0].quantity).toBe(5);
    });

    it('should remove item when quantity is zero', () => {
      service.addItem(mockProduct1);
      service.updateQuantity('A', 0);

      expect(service.items().length).toBe(0);
    });

    it('should remove item when quantity is negative', () => {
      service.addItem(mockProduct1);
      service.updateQuantity('A', -1);

      expect(service.items().length).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      service.addItem(mockProduct1);
      service.addItem(mockProduct2);
      service.clearCart();

      expect(service.items().length).toBe(0);
    });
  });

  describe('itemCount', () => {
    it('should return zero for empty cart', () => {
      expect(service.itemCount()).toBe(0);
    });

    it('should return total quantity of all items', () => {
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);
      service.addItem(mockProduct2);

      expect(service.itemCount()).toBe(3);
    });
  });

  describe('subtotal', () => {
    it('should return zero for empty cart', () => {
      expect(service.subtotal()).toBe(0);
    });

    it('should calculate subtotal without offers', () => {
      service.addItem(mockProduct1); // 1.00
      service.addItem(mockProduct1); // 1.00
      service.addItem(mockProduct2); // 0.50

      expect(service.subtotal()).toBe(2.50);
    });
  });

  describe('totalWithOffers', () => {
    it('should calculate total without offers', () => {
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);

      expect(service.totalWithOffers()).toBe(2.00);
    });

    it('should apply offer when quantity meets requirement', () => {
      service.setOffers([mockOffer]);
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);

      // 3 apples with offer: 2.50 instead of 3.00
      expect(service.totalWithOffers()).toBe(2.50);
    });

    it('should calculate mixed pricing with bundle and remainder', () => {
      service.setOffers([mockOffer]);
      // Add 5 apples: 3 at offer price (2.50) + 2 at regular price (2.00) = 4.50
      for (let i = 0; i < 5; i++) {
        service.addItem(mockProduct1);
      }

      expect(service.totalWithOffers()).toBe(4.50);
    });

    it('should handle multiple products with offers', () => {
      service.setOffers([mockOffer]);
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);
      service.addItem(mockProduct2);
      service.addItem(mockProduct2);

      // 3 apples at 2.50 + 2 bananas at 0.50 each = 2.50 + 1.00 = 3.50
      expect(service.totalWithOffers()).toBe(3.50);
    });
  });

  describe('savings', () => {
    it('should return zero when no offers apply', () => {
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);

      expect(service.savings()).toBe(0);
    });

    it('should calculate savings when offer applies', () => {
      service.setOffers([mockOffer]);
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);

      // Regular: 3.00, With offer: 2.50, Savings: 0.50
      expect(service.savings()).toBe(0.50);
    });
  });

  describe('getCheckoutRequest', () => {
    it('should return empty items for empty cart', () => {
      const request = service.getCheckoutRequest();

      expect(Object.keys(request.items).length).toBe(0);
    });

    it('should return correct checkout request format', () => {
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);
      service.addItem(mockProduct2);

      const request = service.getCheckoutRequest();

      expect(request.items['A']).toBe(2);
      expect(request.items['B']).toBe(1);
    });
  });

  describe('setOffers', () => {
    it('should set offers', () => {
      service.setOffers([mockOffer]);
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);
      service.addItem(mockProduct1);

      // Verify offer is applied
      expect(service.totalWithOffers()).toBe(2.50);
    });
  });
});

