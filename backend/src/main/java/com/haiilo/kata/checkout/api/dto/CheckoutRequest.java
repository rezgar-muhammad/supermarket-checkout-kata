package com.haiilo.kata.checkout.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class CheckoutRequest {

    @NotNull(message = "Items cannot be null")
    private Map<String, Integer> items; // productId -> quantity
}
