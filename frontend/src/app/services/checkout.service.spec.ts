import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CheckoutService } from './checkout.service';
import { CheckoutRequest, CheckoutResponse } from '../models/checkout.model';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CheckoutService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkout', () => {
    it('should send checkout request and return response', () => {
      const request: CheckoutRequest = {
        items: { 'A': 3, 'B': 2 }
      };
      const mockResponse: CheckoutResponse = {
        totalPrice: 3.50
      };

      service.checkout(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.totalPrice).toBe(3.50);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/checkout');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should send empty cart checkout request', () => {
      const request: CheckoutRequest = {
        items: {}
      };
      const mockResponse: CheckoutResponse = {
        totalPrice: 0
      };

      service.checkout(request).subscribe(response => {
        expect(response.totalPrice).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/checkout');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should handle server error', () => {
      const request: CheckoutRequest = {
        items: { 'A': 1 }
      };

      service.checkout(request).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/checkout');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});

