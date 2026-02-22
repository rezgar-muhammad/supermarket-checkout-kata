package com.haiilo.kata.checkout.api;

import com.haiilo.kata.checkout.api.dto.CheckoutRequest;
import com.haiilo.kata.checkout.api.dto.CheckoutResponse;
import com.haiilo.kata.checkout.model.Cart;
import com.haiilo.kata.checkout.service.CheckoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:4200}")
public class CheckoutController {
    private final CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<CheckoutResponse> calculateTotal(@Valid @RequestBody CheckoutRequest checkoutRequest) {
        log.info("Received checkout request with {} items", checkoutRequest.getItems().size());

        Cart cart = new Cart();
        cart.setItems(checkoutRequest.getItems());

        BigDecimal total = checkoutService.calculateTotal(cart);
        log.info("Checkout completed, total: {}", total);

        return ResponseEntity.ok(new CheckoutResponse(total));
    }
}
