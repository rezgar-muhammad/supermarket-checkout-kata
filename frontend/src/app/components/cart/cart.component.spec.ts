import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { Product, Offer } from '../../models/product.model';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('items signal', () => {
    it('should expose cart items from service', () => {
      cartService.addItem(mockProduct1);
      fixture.detectChanges();

      expect(component.items().length).toBe(1);
      expect(component.items()[0].product.id).toBe('A');
    });
  });

  describe('itemCount signal', () => {
    it('should return total item count', () => {
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct2);
      fixture.detectChanges();

      expect(component.itemCount()).toBe(3);
    });
  });

  describe('subtotal signal', () => {
    it('should return cart subtotal', () => {
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct2);
      fixture.detectChanges();

      expect(component.subtotal()).toBe(1.50);
    });
  });

  describe('totalWithOffers signal', () => {
    it('should return total with offers applied', () => {
      cartService.setOffers([mockOffer]);
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct1);
      fixture.detectChanges();

      expect(component.totalWithOffers()).toBe(2.50);
    });
  });

  describe('savings signal', () => {
    it('should return savings amount', () => {
      cartService.setOffers([mockOffer]);
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct1);
      fixture.detectChanges();

      expect(component.savings()).toBe(0.50);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      cartService.addItem(mockProduct1);
      fixture.detectChanges();

      const mockEvent = {
        target: { value: '5' }
      } as unknown as Event;

      component.updateQuantity('A', mockEvent);
      fixture.detectChanges();

      expect(component.items()[0].quantity).toBe(5);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct2);
      fixture.detectChanges();

      component.removeItem('A');
      fixture.detectChanges();

      expect(component.items().length).toBe(1);
      expect(component.items()[0].product.id).toBe('B');
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct2);
      fixture.detectChanges();

      component.clearCart();
      fixture.detectChanges();

      expect(component.items().length).toBe(0);
    });
  });

  describe('checkout', () => {
    it('should emit checkoutRequested event', () => {
      let emitted = false;
      component.checkoutRequested.subscribe(() => {
        emitted = true;
      });

      component.checkout();

      expect(emitted).toBe(true);
    });
  });

  describe('trackByProductId', () => {
    it('should return product id', () => {
      const cartItem = { product: mockProduct1, quantity: 1 };
      const result = component.trackByProductId(0, cartItem);

      expect(result).toBe('A');
    });
  });

  describe('template rendering', () => {
    it('should display empty cart state', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(component.items().length).toBe(0);
    });

    it('should display cart items', () => {
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct2);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const cartItems = compiled.querySelectorAll('.cart-item');

      expect(cartItems.length).toBe(2);
    });

    it('should display item count', () => {
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct1);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const itemCount = compiled.querySelector('.item-count');

      expect(itemCount?.textContent).toContain('2 items');
    });

    it('should display subtotal', () => {
      cartService.addItem(mockProduct1);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('€1.00');
    });

    it('should display savings when offers apply', () => {
      cartService.setOffers([mockOffer]);
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct1);
      cartService.addItem(mockProduct1);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const savings = compiled.querySelector('.savings');

      expect(savings?.textContent).toContain('-€0.50');
    });

    it('should not display savings when no offers apply', () => {
      cartService.addItem(mockProduct1);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const savings = compiled.querySelector('.savings');

      expect(savings).toBeNull();
    });
  });
});

