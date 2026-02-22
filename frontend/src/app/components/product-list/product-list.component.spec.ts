import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductListComponent } from './product-list.component';
import { CartService } from '../../services/cart.service';
import { Product, Offer } from '../../models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let httpMock: HttpTestingController;
  let cartService: CartService;

  const mockProducts: Product[] = [
    { id: 'A', name: 'Apple', price: 1.00 },
    { id: 'B', name: 'Banana', price: 0.50 }
  ];

  const mockOffers: Offer[] = [
    { id: 'offer1', productId: 'A', requiredQuantity: 3, offerPrice: 2.50, active: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    cartService = TestBed.inject(CartService);
  });

  afterEach(() => {
    // Flush any remaining requests
    const productReqs = httpMock.match('http://localhost:8080/api/products');
    productReqs.forEach(req => req.flush([]));
    const offerReqs = httpMock.match('http://localhost:8080/api/offers');
    offerReqs.forEach(req => req.flush([]));
  });

  function flushAllRequests(products: Product[] = mockProducts, offers: Offer[] = mockOffers): void {
    fixture.detectChanges();

    // Handle all product requests
    const productReqs = httpMock.match('http://localhost:8080/api/products');
    productReqs.forEach(req => req.flush(products));

    // Handle all offer requests
    const offerReqs = httpMock.match('http://localhost:8080/api/offers');
    offerReqs.forEach(req => req.flush(offers));

    fixture.detectChanges();
  }

  it('should create', () => {
    flushAllRequests();
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    flushAllRequests();
    expect(component.products().length).toBe(2);
  });

  it('should load offers on init', () => {
    flushAllRequests();
    expect(component.offers().length).toBe(1);
  });

  describe('addToCart', () => {
    it('should add product to cart service', () => {
      flushAllRequests();
      spyOn(cartService, 'addItem');
      component.addToCart(mockProducts[0]);

      expect(cartService.addItem).toHaveBeenCalledWith(mockProducts[0]);
    });
  });

  describe('getOfferForProduct', () => {
    it('should return offer string for product with offer', () => {
      flushAllRequests();
      const offer = component.getOfferForProduct('A');

      expect(offer).toBe('Buy 3 for €2.50');
    });

    it('should return null for product without offer', () => {
      flushAllRequests();
      const offer = component.getOfferForProduct('B');

      expect(offer).toBeNull();
    });

    it('should return null for non-existent product', () => {
      flushAllRequests();
      const offer = component.getOfferForProduct('INVALID');

      expect(offer).toBeNull();
    });
  });

  describe('trackByProductId', () => {
    it('should return product id', () => {
      flushAllRequests();
      const result = component.trackByProductId(0, mockProducts[0]);

      expect(result).toBe('A');
    });
  });

  describe('template rendering', () => {
    it('should display products', () => {
      flushAllRequests();
      const compiled = fixture.nativeElement as HTMLElement;
      const productCards = compiled.querySelectorAll('.product-card');

      expect(productCards.length).toBe(2);
    });

    it('should display product name and price', () => {
      flushAllRequests();
      const compiled = fixture.nativeElement as HTMLElement;
      const firstProduct = compiled.querySelector('.product-card');

      expect(firstProduct?.textContent).toContain('Apple');
      expect(firstProduct?.textContent).toContain('€1.00');
    });

    it('should display offer badge for products with offers', () => {
      flushAllRequests();
      const compiled = fixture.nativeElement as HTMLElement;
      const offerBadge = compiled.querySelector('.offer-badge');

      expect(offerBadge?.textContent).toContain('Buy 3 for €2.50');
    });

    it('should show empty message when no products', () => {
      flushAllRequests([], []);
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('No products available');
    });
  });
});

