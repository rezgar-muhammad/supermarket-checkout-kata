package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class CheckoutService {

    private final ProductRepository productRepository;

    public CheckoutService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // This method should calculate the total price of the items in the cart,
    // applying any relevant offers or discounts.
    public BigDecimal calculateTotal() {

        // how to bring in the shopping cart? should it be passed as a parameter?
        // or should it be stored in the service?
        return BigDecimal.valueOf(19.99);
    }
}
