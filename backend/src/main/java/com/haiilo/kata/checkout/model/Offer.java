package com.haiilo.kata.checkout.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Offer {

    @Id
    private String id;

    private String productId;

    private int requiredQuantity;

    private BigDecimal offerPrice;

    private boolean active;
}

