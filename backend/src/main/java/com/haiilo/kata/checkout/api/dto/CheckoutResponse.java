package com.haiilo.kata.checkout.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CheckoutResponse {
    private BigDecimal totalPrice;
}
