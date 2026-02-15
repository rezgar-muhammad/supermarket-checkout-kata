package com.haiilo.kata.checkout.offer;

import java.math.BigDecimal;

// Use strategy pattern to apply different offers to products in the shopping cart
public interface OfferStrategy {

    BigDecimal calculatePrice(int quantity, BigDecimal itemPrice);
}
