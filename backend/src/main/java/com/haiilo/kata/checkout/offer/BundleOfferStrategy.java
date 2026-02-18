package com.haiilo.kata.checkout.offer;

import com.haiilo.kata.checkout.model.Offer;
import com.haiilo.kata.checkout.model.Product;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
public class BundleOfferStrategy implements PricingStrategy {

    private final Offer offer;

    @Override
    public BigDecimal calculate(Product product, int quantity) {
        int bundles = quantity / offer.getRequiredQuantity();
        int remainder = quantity % offer.getRequiredQuantity();

        BigDecimal bundleTotal = offer.getOfferPrice().multiply(BigDecimal.valueOf(bundles));
        BigDecimal remainderTotal = product.getPrice().multiply(BigDecimal.valueOf(remainder));

        return bundleTotal.add(remainderTotal);
    }
}

