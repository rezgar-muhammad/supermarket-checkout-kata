package com.haiilo.kata.checkout.offer;

import com.haiilo.kata.checkout.model.Product;

import java.math.BigDecimal;

public class RegularPricingStrategy implements PricingStrategy {


    @Override
    public BigDecimal calculate(Product product, int quantity) {
        return product.getPrice().multiply(BigDecimal.valueOf(quantity));
    }
}
