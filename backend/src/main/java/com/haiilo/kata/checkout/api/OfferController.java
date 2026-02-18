package com.haiilo.kata.checkout.api;

import com.haiilo.kata.checkout.model.Offer;
import com.haiilo.kata.checkout.service.OfferService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/offers")
@CrossOrigin(origins = "http://localhost:4200")
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    public ResponseEntity<List<Offer>> getActiveOffers() {
        log.info("GET /api/offers - Fetching active offers");
        List<Offer> offers = offerService.getActiveOffers();
        log.debug("Returning {} active offers", offers.size());
        return ResponseEntity.ok(offers);
    }
}

