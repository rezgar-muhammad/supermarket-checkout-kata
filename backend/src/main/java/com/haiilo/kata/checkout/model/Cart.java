package com.haiilo.kata.checkout.model;

import lombok.Getter;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Getter
public class Cart {
    private final Map<String, Integer> items = new HashMap<>();

    public void addItem(String productId) {
        items.put(productId, items.getOrDefault(productId, 0) + 1);
    }

    public void setItems(Map<String, Integer> items) {
        this.items.clear();
        this.items.putAll(items);
    }

    public Map<String, Integer> getItems() {
        return Collections.unmodifiableMap(items);
    }
}
