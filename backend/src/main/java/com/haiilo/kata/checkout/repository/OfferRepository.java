package com.haiilo.kata.checkout.repository;

import com.haiilo.kata.checkout.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, String> {

    Optional<Offer> findByProductIdAndActiveTrue(String productId);
}

