package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.exception.ProductNotFoundException;
import com.haiilo.kata.checkout.model.Cart;
import com.haiilo.kata.checkout.model.Product;
import com.haiilo.kata.checkout.offer.BundleOfferStrategy;
import com.haiilo.kata.checkout.offer.PricingStrategy;
import com.haiilo.kata.checkout.offer.RegularPricingStrategy;
import com.haiilo.kata.checkout.repository.OfferRepository;
import com.haiilo.kata.checkout.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final ProductRepository productRepository;
    private final OfferRepository offerRepository;

    /**
     * Calculates total price for all items in cart
     * Uses Strategy Pattern: BundleOfferStrategy for offers, RegularPricingStrategy otherwise
     */
    public BigDecimal calculateTotal(Cart cart) {
        log.info("Calculating total for cart with {} item(s)", cart.getItems().size());
        BigDecimal total = BigDecimal.ZERO;

        try {
            for (Map.Entry<String, Integer> entry : cart.getItems().entrySet()) {
                String productId = entry.getKey();
                int quantity = entry.getValue();

                log.debug("Processing product: {}, quantity: {}", productId, quantity);

                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new ProductNotFoundException(productId));

                // Strategy Pattern: select pricing strategy based on active offer
                PricingStrategy strategy = offerRepository.findByProductIdAndActiveTrue(productId)
                        .<PricingStrategy>map(offer -> {
                            log.debug("Applying bundle offer for product: {}", productId);
                            return new BundleOfferStrategy(offer);
                        })
                        .orElseGet(() -> {
                            log.debug("No offer found, using regular pricing for product: {}", productId);
                            return new RegularPricingStrategy();
                        });

                BigDecimal itemTotal = strategy.calculate(product, quantity);
                log.debug("Item total for {}: {}", productId, itemTotal);

                total = total.add(itemTotal);
            }

            log.info("Cart total calculated successfully: {}", total);
            return total;

        } catch (ProductNotFoundException e) {
            log.error("Product not found during checkout: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error calculating cart total: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to calculate cart total", e);
        }
    }
}
