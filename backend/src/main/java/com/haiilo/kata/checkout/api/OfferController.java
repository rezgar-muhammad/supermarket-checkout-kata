package com.haiilo.kata.checkout.api;

import com.haiilo.kata.checkout.model.Offer;
import com.haiilo.kata.checkout.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/offers")
@CrossOrigin(origins = "http://localhost:4200")
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    public ResponseEntity<List<Offer>> getActiveOffers() {
        return ResponseEntity.ok(offerService.getActiveOffers());
    }
}

