package com.haiilo.kata.checkout.offer;

import com.haiilo.kata.checkout.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("RegularPricingStrategy")
class RegularPricingStrategyTest {

    private RegularPricingStrategy strategy;
    private Product apple;

    @BeforeEach
    void setUp() {
        strategy = new RegularPricingStrategy();

        apple = new Product();
        apple.setId("A");
        apple.setName("Apple");
        apple.setPrice(new BigDecimal("1.50"));
    }

    @Nested
    @DisplayName("calculate")
    class Calculate {

        @Test
        @DisplayName("should calculate price for single item")
        void shouldCalculatePriceForSingleItem() {
            BigDecimal total = strategy.calculate(apple, 1);

            assertThat(total).isEqualByComparingTo(new BigDecimal("1.50"));
        }

        @Test
        @DisplayName("should calculate price for multiple items")
        void shouldCalculatePriceForMultipleItems() {
            BigDecimal total = strategy.calculate(apple, 5);

            assertThat(total).isEqualByComparingTo(new BigDecimal("7.50"));
        }

        @Test
        @DisplayName("should return zero for zero quantity")
        void shouldReturnZeroForZeroQuantity() {
            BigDecimal total = strategy.calculate(apple, 0);

            assertThat(total).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("should handle large quantities")
        void shouldHandleLargeQuantities() {
            BigDecimal total = strategy.calculate(apple, 100);

            assertThat(total).isEqualByComparingTo(new BigDecimal("150.00"));
        }

        @Test
        @DisplayName("should handle products with decimal prices")
        void shouldHandleProductsWithDecimalPrices() {
            Product banana = new Product();
            banana.setId("B");
            banana.setName("Banana");
            banana.setPrice(new BigDecimal("0.35"));

            BigDecimal total = strategy.calculate(banana, 3);

            assertThat(total).isEqualByComparingTo(new BigDecimal("1.05"));
        }
    }
}

