package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.exception.ProductNotFoundException;
import com.haiilo.kata.checkout.model.Cart;
import com.haiilo.kata.checkout.model.Product;
import com.haiilo.kata.checkout.offer.BundleOfferStrategy;
import com.haiilo.kata.checkout.offer.PricingStrategy;
import com.haiilo.kata.checkout.offer.RegularPricingStrategy;
import com.haiilo.kata.checkout.repository.OfferRepository;
import com.haiilo.kata.checkout.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class CheckoutService {

    private final ProductRepository productRepository;
    private final OfferRepository offerRepository;

    public CheckoutService(ProductRepository productRepository, OfferRepository offerRepository) {
        this.productRepository = productRepository;
        this.offerRepository = offerRepository;
    }

    /**
     * Calculates total price for all items in cart
     * Uses Strategy Pattern: BundleOfferStrategy for offers, RegularPricingStrategy otherwise
     */
    public BigDecimal calculateTotal(Cart cart) {
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<String, Integer> entry : cart.getItems().entrySet()) {
            String productId = entry.getKey();
            int quantity = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ProductNotFoundException(productId));

            // Strategy Pattern: select pricing strategy based on active offer
            PricingStrategy strategy = offerRepository.findByProductIdAndActiveTrue(productId)
                    .<PricingStrategy>map(BundleOfferStrategy::new)
                    .orElseGet(RegularPricingStrategy::new);

            total = total.add(strategy.calculate(product, quantity));
        }


        return total;
    }
}
