package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.exception.ProductNotFoundException;
import com.haiilo.kata.checkout.model.Cart;
import com.haiilo.kata.checkout.model.Offer;
import com.haiilo.kata.checkout.model.Product;
import com.haiilo.kata.checkout.repository.OfferRepository;
import com.haiilo.kata.checkout.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CheckoutService")
class CheckoutServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OfferRepository offerRepository;

    @InjectMocks
    private CheckoutService checkoutService;

    private Product apple;
    private Product banana;
    private Offer appleOffer;

    @BeforeEach
    void setUp() {
        apple = new Product();
        apple.setId("A");
        apple.setName("Apple");
        apple.setPrice(new BigDecimal("1.00"));

        banana = new Product();
        banana.setId("B");
        banana.setName("Banana");
        banana.setPrice(new BigDecimal("0.50"));

        appleOffer = new Offer("offer1", "A", 3, new BigDecimal("2.50"), true);
    }

    @Nested
    @DisplayName("calculateTotal")
    class CalculateTotal {

        @Test
        @DisplayName("should return zero for empty cart")
        void shouldReturnZeroForEmptyCart() {
            Cart cart = new Cart();

            BigDecimal total = checkoutService.calculateTotal(cart);

            assertThat(total).isEqualByComparingTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("should calculate regular price when no offer exists")
        void shouldCalculateRegularPriceWhenNoOfferExists() {
            Cart cart = new Cart();
            cart.addItem("B");
            cart.addItem("B");

            when(productRepository.findById("B")).thenReturn(Optional.of(banana));
            when(offerRepository.findByProductIdAndActiveTrue("B")).thenReturn(Optional.empty());

            BigDecimal total = checkoutService.calculateTotal(cart);

            assertThat(total).isEqualByComparingTo(new BigDecimal("1.00"));
            verify(productRepository).findById("B");
            verify(offerRepository).findByProductIdAndActiveTrue("B");
        }

        @Test
        @DisplayName("should apply bundle offer when quantity meets requirement")
        void shouldApplyBundleOfferWhenQuantityMeetsRequirement() {
            Cart cart = new Cart();
            cart.addItem("A");
            cart.addItem("A");
            cart.addItem("A");

            when(productRepository.findById("A")).thenReturn(Optional.of(apple));
            when(offerRepository.findByProductIdAndActiveTrue("A")).thenReturn(Optional.of(appleOffer));

            BigDecimal total = checkoutService.calculateTotal(cart);

            // 3 apples with offer: 2.50 instead of 3.00
            assertThat(total).isEqualByComparingTo(new BigDecimal("2.50"));
        }

        @Test
        @DisplayName("should calculate mixed pricing with bundle and remainder")
        void shouldCalculateMixedPricingWithBundleAndRemainder() {
            Cart cart = new Cart();
            // Add 5 apples: 3 at offer price (2.50) + 2 at regular price (2.00) = 4.50
            cart.addItem("A");
            cart.addItem("A");
            cart.addItem("A");
            cart.addItem("A");
            cart.addItem("A");

            when(productRepository.findById("A")).thenReturn(Optional.of(apple));
            when(offerRepository.findByProductIdAndActiveTrue("A")).thenReturn(Optional.of(appleOffer));

            BigDecimal total = checkoutService.calculateTotal(cart);

            assertThat(total).isEqualByComparingTo(new BigDecimal("4.50"));
        }

        @Test
        @DisplayName("should calculate total for multiple products")
        void shouldCalculateTotalForMultipleProducts() {
            Cart cart = new Cart();
            cart.addItem("A");
            cart.addItem("A");
            cart.addItem("A");
            cart.addItem("B");
            cart.addItem("B");

            when(productRepository.findById("A")).thenReturn(Optional.of(apple));
            when(productRepository.findById("B")).thenReturn(Optional.of(banana));
            when(offerRepository.findByProductIdAndActiveTrue("A")).thenReturn(Optional.of(appleOffer));
            when(offerRepository.findByProductIdAndActiveTrue("B")).thenReturn(Optional.empty());

            BigDecimal total = checkoutService.calculateTotal(cart);

            // 3 apples at 2.50 + 2 bananas at 0.50 each = 2.50 + 1.00 = 3.50
            assertThat(total).isEqualByComparingTo(new BigDecimal("3.50"));
        }

        @Test
        @DisplayName("should throw ProductNotFoundException when product not found")
        void shouldThrowProductNotFoundExceptionWhenProductNotFound() {
            Cart cart = new Cart();
            cart.addItem("INVALID");

            when(productRepository.findById("INVALID")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> checkoutService.calculateTotal(cart))
                    .isInstanceOf(ProductNotFoundException.class)
                    .hasMessageContaining("INVALID");
        }

        @Test
        @DisplayName("should handle multiple bundles of same product")
        void shouldHandleMultipleBundlesOfSameProduct() {
            Cart cart = new Cart();
            // Add 7 apples: 2 bundles (2 * 2.50 = 5.00) + 1 remainder (1.00) = 6.00
            for (int i = 0; i < 7; i++) {
                cart.addItem("A");
            }

            when(productRepository.findById("A")).thenReturn(Optional.of(apple));
            when(offerRepository.findByProductIdAndActiveTrue("A")).thenReturn(Optional.of(appleOffer));

            BigDecimal total = checkoutService.calculateTotal(cart);

            assertThat(total).isEqualByComparingTo(new BigDecimal("6.00"));
        }
    }
}

