package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.exception.ProductNotFoundException;
import com.haiilo.kata.checkout.model.Product;
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
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product apple;
    private Product banana;

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
    }

    @Nested
    @DisplayName("getAllProducts")
    class GetAllProducts {

        @Test
        @DisplayName("should return all products")
        void shouldReturnAllProducts() {
            when(productRepository.findAll()).thenReturn(Arrays.asList(apple, banana));

            List<Product> products = productService.getAllProducts();

            assertThat(products).hasSize(2);
            assertThat(products).containsExactly(apple, banana);
            verify(productRepository).findAll();
        }

        @Test
        @DisplayName("should return empty list when no products exist")
        void shouldReturnEmptyListWhenNoProductsExist() {
            when(productRepository.findAll()).thenReturn(Collections.emptyList());

            List<Product> products = productService.getAllProducts();

            assertThat(products).isEmpty();
            verify(productRepository).findAll();
        }
    }

    @Nested
    @DisplayName("getProductById")
    class GetProductById {

        @Test
        @DisplayName("should return product when found")
        void shouldReturnProductWhenFound() {
            when(productRepository.findById("A")).thenReturn(Optional.of(apple));

            Product product = productService.getProductById("A");

            assertThat(product).isEqualTo(apple);
            assertThat(product.getName()).isEqualTo("Apple");
            verify(productRepository).findById("A");
        }

        @Test
        @DisplayName("should throw ProductNotFoundException when product not found")
        void shouldThrowProductNotFoundExceptionWhenProductNotFound() {
            when(productRepository.findById("INVALID")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> productService.getProductById("INVALID"))
                    .isInstanceOf(ProductNotFoundException.class)
                    .hasMessageContaining("INVALID");

            verify(productRepository).findById("INVALID");
        }
    }
}

