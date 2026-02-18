package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.model.Offer;
import com.haiilo.kata.checkout.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;

    public List<Offer> getActiveOffers() {
        log.info("Fetching all active offers");
        List<Offer> activeOffers = offerRepository.findAll()
                .stream()
                .filter(Offer::isActive)
                .toList();
        log.debug("Found {} active offers", activeOffers.size());
        return activeOffers;
    }
}

