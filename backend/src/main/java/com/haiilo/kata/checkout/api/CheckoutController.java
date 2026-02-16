package com.haiilo.kata.checkout.api;

import com.haiilo.kata.checkout.api.dto.CheckoutRequest;
import com.haiilo.kata.checkout.api.dto.CheckoutResponse;
import com.haiilo.kata.checkout.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping
@CrossOrigin(origins = "http://localhost:4200")
public class CheckoutController {
    private final CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<CheckoutResponse> calculateTotal(@RequestBody CheckoutRequest checkoutRequest) {
        return ResponseEntity.ok(checkoutService.calculateTotal());
    }
}
