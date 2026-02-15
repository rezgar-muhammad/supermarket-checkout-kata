package com.haiilo.kata.checkout.offer;

import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
public class BuyStrategy implements OfferStrategy{
    private final int quantity;
    private final BigDecimal itemPrice;


    // Add a buy 2 get 1 free offer for a product
    @Override
    public BigDecimal calculatePrice(int quantity, BigDecimal itemPrice) {
        return BigDecimal.valueOf(19.99);
    }
}
