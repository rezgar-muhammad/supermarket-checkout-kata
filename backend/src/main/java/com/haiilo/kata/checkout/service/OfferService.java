package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.model.Offer;
import com.haiilo.kata.checkout.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;

    public List<Offer> getActiveOffers() {
        return offerRepository.findAll()
                .stream()
                .filter(Offer::isActive)
                .toList();
    }
}

