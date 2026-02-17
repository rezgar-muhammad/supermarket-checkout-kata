package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.exception.ProductNotFoundException;
import com.haiilo.kata.checkout.model.Cart;
import com.haiilo.kata.checkout.model.Offer;
import com.haiilo.kata.checkout.model.Product;
import com.haiilo.kata.checkout.repository.OfferRepository;
import com.haiilo.kata.checkout.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@Service
public class CheckoutService {

    private final ProductRepository productRepository;
    private final OfferRepository offerRepository;

    public CheckoutService(ProductRepository productRepository, OfferRepository offerRepository) {
        this.productRepository = productRepository;
        this.offerRepository = offerRepository;
    }


    public BigDecimal calculateTotal(Cart cart) {
        BigDecimal total = BigDecimal.ZERO;

        Map<String, Integer> cartItems = cart.getItems();

        for (Map.Entry<String, Integer> entry : cartItems.entrySet()) {
            String productId = entry.getKey();
            int quantity = entry.getValue();

            // 1. Get product and its price
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ProductNotFoundException(productId));

            // 2. Check if there's an active offer for this product
            Optional<Offer> offer = offerRepository.findByProductIdAndActiveTrue(productId);

            if (offer.isPresent()) {
                // 3. Apply offer: calculate how many "offer bundles" apply
                Offer activeOffer = offer.get();
                int offerQuantity = activeOffer.getRequiredQuantity(); // e.g., 2 apples
                BigDecimal offerPrice = activeOffer.getOfferPrice();   // e.g., 0.45€

                int offerBundles = quantity / offerQuantity;  // full offer sets
                int remainder = quantity % offerQuantity;     // items at regular price

                // 4. Calculate: (bundles * offerPrice) + (remainder * regularPrice)
                BigDecimal bundleTotal = offerPrice.multiply(BigDecimal.valueOf(offerBundles));
                BigDecimal remainderTotal = product.getPrice().multiply(BigDecimal.valueOf(remainder));

                total = total.add(bundleTotal).add(remainderTotal);
            } else {
                // 5. No offer: regular price * quantity
                total = total.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            }
        }


        return total;
    }
}
