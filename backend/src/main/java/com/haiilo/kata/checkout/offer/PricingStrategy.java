package com.haiilo.kata.checkout.offer;

import com.haiilo.kata.checkout.model.Product;

import java.math.BigDecimal;

public interface PricingStrategy {

    BigDecimal calculate(Product product, int quantity);
}
