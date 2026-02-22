import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, Offer } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    { id: 'A', name: 'Apple', price: 1.00 },
    { id: 'B', name: 'Banana', price: 0.50 }
  ];

  const mockOffers: Offer[] = [
    { id: 'offer1', productId: 'A', requiredQuantity: 3, offerPrice: 2.50, active: true },
    { id: 'offer2', productId: 'B', requiredQuantity: 2, offerPrice: 0.80, active: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return products from API', () => {
      service.getProducts().subscribe(products => {
        expect(products.length).toBe(2);
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should return empty array when no products', () => {
      service.getProducts().subscribe(products => {
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/products');
      req.flush([]);
    });
  });

  describe('getOffers', () => {
    it('should return offers from API', () => {
      service.getOffers().subscribe(offers => {
        expect(offers.length).toBe(2);
        expect(offers).toEqual(mockOffers);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/offers');
      expect(req.request.method).toBe('GET');
      req.flush(mockOffers);
    });

    it('should return empty array when no offers', () => {
      service.getOffers().subscribe(offers => {
        expect(offers.length).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/offers');
      req.flush([]);
    });
  });
});

