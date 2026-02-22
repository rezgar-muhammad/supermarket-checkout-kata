package com.haiilo.kata.checkout.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Cart")
class CartTest {

    private Cart cart;

    @BeforeEach
    void setUp() {
        cart = new Cart();
    }

    @Nested
    @DisplayName("addItem")
    class AddItem {

        @Test
        @DisplayName("should add new item with quantity 1")
        void shouldAddNewItemWithQuantity1() {
            cart.addItem("A");

            assertThat(cart.getItems()).containsEntry("A", 1);
        }

        @Test
        @DisplayName("should increment quantity when adding existing item")
        void shouldIncrementQuantityWhenAddingExistingItem() {
            cart.addItem("A");
            cart.addItem("A");
            cart.addItem("A");

            assertThat(cart.getItems()).containsEntry("A", 3);
        }

        @Test
        @DisplayName("should handle multiple different items")
        void shouldHandleMultipleDifferentItems() {
            cart.addItem("A");
            cart.addItem("B");
            cart.addItem("A");
            cart.addItem("C");

            assertThat(cart.getItems())
                    .containsEntry("A", 2)
                    .containsEntry("B", 1)
                    .containsEntry("C", 1);
        }
    }

    @Nested
    @DisplayName("setItems")
    class SetItems {

        @Test
        @DisplayName("should set items from map")
        void shouldSetItemsFromMap() {
            Map<String, Integer> items = new HashMap<>();
            items.put("A", 5);
            items.put("B", 3);

            cart.setItems(items);

            assertThat(cart.getItems())
                    .containsEntry("A", 5)
                    .containsEntry("B", 3)
                    .hasSize(2);
        }

        @Test
        @DisplayName("should clear existing items when setting new items")
        void shouldClearExistingItemsWhenSettingNewItems() {
            cart.addItem("X");
            cart.addItem("Y");

            Map<String, Integer> newItems = new HashMap<>();
            newItems.put("A", 1);

            cart.setItems(newItems);

            assertThat(cart.getItems())
                    .containsEntry("A", 1)
                    .doesNotContainKey("X")
                    .doesNotContainKey("Y")
                    .hasSize(1);
        }

        @Test
        @DisplayName("should handle empty map")
        void shouldHandleEmptyMap() {
            cart.addItem("A");
            cart.setItems(new HashMap<>());

            assertThat(cart.getItems()).isEmpty();
        }
    }

    @Nested
    @DisplayName("getItems")
    class GetItems {

        @Test
        @DisplayName("should return empty map for new cart")
        void shouldReturnEmptyMapForNewCart() {
            assertThat(cart.getItems()).isEmpty();
        }

        @Test
        @DisplayName("should return unmodifiable map")
        void shouldReturnUnmodifiableMap() {
            cart.addItem("A");
            Map<String, Integer> items = cart.getItems();

            assertThatThrownBy(() -> items.put("B", 1))
                    .isInstanceOf(UnsupportedOperationException.class);
        }
    }
}

