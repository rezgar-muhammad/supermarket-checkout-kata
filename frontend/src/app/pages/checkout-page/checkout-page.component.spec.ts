import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CheckoutPageComponent } from './checkout-page.component';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

describe('CheckoutPageComponent', () => {
  let component: CheckoutPageComponent;
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let httpMock: HttpTestingController;
  let cartService: CartService;

  const mockProduct: Product = {
    id: 'A',
    name: 'Apple',
    price: 1.00
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    cartService = TestBed.inject(CartService);
  });

  afterEach(() => {
    // Flush any remaining requests before verify
    const productReqs = httpMock.match('http://localhost:8080/api/products');
    productReqs.forEach(req => req.flush([]));
    const offerReqs = httpMock.match('http://localhost:8080/api/offers');
    offerReqs.forEach(req => req.flush([]));
  });

  function flushProductRequests(): void {
    fixture.detectChanges();

    // Handle all product requests from child components
    const productReqs = httpMock.match('http://localhost:8080/api/products');
    productReqs.forEach(req => req.flush([mockProduct]));

    // Handle all offer requests
    const offerReqs = httpMock.match('http://localhost:8080/api/offers');
    offerReqs.forEach(req => req.flush([]));

    fixture.detectChanges();
  }

  it('should create', () => {
    flushProductRequests();
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should not be loading initially', () => {
      flushProductRequests();
      expect(component.isLoading()).toBe(false);
    });

    it('should not have checkout result initially', () => {
      flushProductRequests();
      expect(component.checkoutResult()).toBeNull();
    });

    it('should not have error initially', () => {
      flushProductRequests();
      expect(component.error()).toBeNull();
    });
  });

  describe('onCheckout', () => {
    it('should set error when cart is empty', () => {
      flushProductRequests();
      component.onCheckout();

      expect(component.error()).toBe('Your cart is empty');
      expect(component.isLoading()).toBe(false);
    });

    it('should send checkout request when cart has items', fakeAsync(() => {
      flushProductRequests();

      cartService.addItem(mockProduct);
      cartService.addItem(mockProduct);
      fixture.detectChanges();

      component.onCheckout();

      expect(component.isLoading()).toBe(true);
      expect(component.error()).toBeNull();

      const checkoutReq = httpMock.expectOne('http://localhost:8080/api/checkout');
      expect(checkoutReq.request.method).toBe('POST');
      expect(checkoutReq.request.body).toEqual({ items: { 'A': 2 } });

      checkoutReq.flush({ totalPrice: 2.00 });
      tick();

      expect(component.isLoading()).toBe(false);
      expect(component.checkoutResult()?.totalPrice).toBe(2.00);
    }));

    it('should clear cart after successful checkout', fakeAsync(() => {
      flushProductRequests();

      cartService.addItem(mockProduct);
      fixture.detectChanges();

      component.onCheckout();

      const checkoutReq = httpMock.expectOne('http://localhost:8080/api/checkout');
      checkoutReq.flush({ totalPrice: 1.00 });
      tick();

      expect(cartService.items().length).toBe(0);
    }));

    it('should handle checkout error', fakeAsync(() => {
      flushProductRequests();

      cartService.addItem(mockProduct);
      fixture.detectChanges();

      component.onCheckout();

      const checkoutReq = httpMock.expectOne('http://localhost:8080/api/checkout');
      checkoutReq.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      tick();

      expect(component.isLoading()).toBe(false);
      expect(component.error()).toBe('Checkout failed. Please try again.');
      expect(component.checkoutResult()).toBeNull();
    }));
  });

  describe('dismissResult', () => {
    it('should clear checkout result', fakeAsync(() => {
      flushProductRequests();

      cartService.addItem(mockProduct);
      component.onCheckout();

      const checkoutReq = httpMock.expectOne('http://localhost:8080/api/checkout');
      checkoutReq.flush({ totalPrice: 1.00 });
      tick();

      expect(component.checkoutResult()).not.toBeNull();

      component.dismissResult();

      expect(component.checkoutResult()).toBeNull();
    }));
  });

  describe('dismissError', () => {
    it('should clear error', () => {
      flushProductRequests();

      component.onCheckout(); // This will set error for empty cart

      expect(component.error()).not.toBeNull();

      component.dismissError();

      expect(component.error()).toBeNull();
    });
  });

  describe('template rendering', () => {
    it('should render product list component', () => {
      flushProductRequests();

      const compiled = fixture.nativeElement as HTMLElement;
      const productList = compiled.querySelector('app-product-list');

      expect(productList).toBeTruthy();
    });

    it('should render cart component', () => {
      flushProductRequests();

      const compiled = fixture.nativeElement as HTMLElement;
      const cart = compiled.querySelector('app-cart');

      expect(cart).toBeTruthy();
    });
  });
});

