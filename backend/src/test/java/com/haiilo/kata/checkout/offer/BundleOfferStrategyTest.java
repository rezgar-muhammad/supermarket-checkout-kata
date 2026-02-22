package com.haiilo.kata.checkout.offer;

import com.haiilo.kata.checkout.model.Offer;
import com.haiilo.kata.checkout.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("BundleOfferStrategy")
class BundleOfferStrategyTest {

    private Product apple;
    private Offer threeForTwoFifty;

    @BeforeEach
    void setUp() {
        apple = new Product();
        apple.setId("A");
        apple.setName("Apple");
        apple.setPrice(new BigDecimal("1.00"));

        // 3 apples for 2.50 (instead of 3.00)
        threeForTwoFifty = new Offer("offer1", "A", 3, new BigDecimal("2.50"), true);
    }

    @Nested
    @DisplayName("calculate")
    class Calculate {

        @Test
        @DisplayName("should apply offer price for exact bundle quantity")
        void shouldApplyOfferPriceForExactBundleQuantity() {
            BundleOfferStrategy strategy = new BundleOfferStrategy(threeForTwoFifty);

            BigDecimal total = strategy.calculate(apple, 3);

            assertThat(total).isEqualByComparingTo(new BigDecimal("2.50"));
        }

        @Test
        @DisplayName("should calculate regular price for quantity less than bundle")
        void shouldCalculateRegularPriceForQuantityLessThanBundle() {
            BundleOfferStrategy strategy = new BundleOfferStrategy(threeForTwoFifty);

            BigDecimal total = strategy.calculate(apple, 2);

            // 2 apples at regular price = 2.00
            assertThat(total).isEqualByComparingTo(new BigDecimal("2.00"));
        }

        @Test
        @DisplayName("should calculate bundle price plus remainder")
        void shouldCalculateBundlePricePlusRemainder() {
            BundleOfferStrategy strategy = new BundleOfferStrategy(threeForTwoFifty);

            BigDecimal total = strategy.calculate(apple, 5);

            // 1 bundle (2.50) + 2 remainder (2.00) = 4.50
            assertThat(total).isEqualByComparingTo(new BigDecimal("4.50"));
        }

        @Test
        @DisplayName("should handle multiple bundles")
        void shouldHandleMultipleBundles() {
            BundleOfferStrategy strategy = new BundleOfferStrategy(threeForTwoFifty);

            BigDecimal total = strategy.calculate(apple, 6);

            // 2 bundles = 2 * 2.50 = 5.00
            assertThat(total).isEqualByComparingTo(new BigDecimal("5.00"));
        }

        @Test
        @DisplayName("should handle multiple bundles with remainder")
        void shouldHandleMultipleBundlesWithRemainder() {
            BundleOfferStrategy strategy = new BundleOfferStrategy(threeForTwoFifty);

            BigDecimal total = strategy.calculate(apple, 7);

            // 2 bundles (5.00) + 1 remainder (1.00) = 6.00
            assertThat(total).isEqualByComparingTo(new BigDecimal("6.00"));
        }

        @Test
        @DisplayName("should return zero for zero quantity")
        void shouldReturnZeroForZeroQuantity() {
            BundleOfferStrategy strategy = new BundleOfferStrategy(threeForTwoFifty);

            BigDecimal total = strategy.calculate(apple, 0);

            assertThat(total).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("should handle single item")
        void shouldHandleSingleItem() {
            BundleOfferStrategy strategy = new BundleOfferStrategy(threeForTwoFifty);

            BigDecimal total = strategy.calculate(apple, 1);

            assertThat(total).isEqualByComparingTo(new BigDecimal("1.00"));
        }

        @Test
        @DisplayName("should handle different offer configurations")
        void shouldHandleDifferentOfferConfigurations() {
            // Buy 2 for 1.50 offer
            Offer twoForOneFifty = new Offer("offer2", "A", 2, new BigDecimal("1.50"), true);
            BundleOfferStrategy strategy = new BundleOfferStrategy(twoForOneFifty);

            BigDecimal total = strategy.calculate(apple, 5);

            // 2 bundles (3.00) + 1 remainder (1.00) = 4.00
            assertThat(total).isEqualByComparingTo(new BigDecimal("4.00"));
        }
    }
}

