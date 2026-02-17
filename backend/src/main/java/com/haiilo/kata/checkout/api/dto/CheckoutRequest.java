package com.haiilo.kata.checkout.api.dto;

import lombok.Data;

import java.util.Map;

@Data
public class CheckoutRequest {
    private Map<String, Integer> items; // productId -> quantity
}
