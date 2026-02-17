package com.haiilo.kata.checkout.api;

import com.haiilo.kata.checkout.api.dto.CheckoutRequest;
import com.haiilo.kata.checkout.api.dto.CheckoutResponse;
import com.haiilo.kata.checkout.model.Cart;
import com.haiilo.kata.checkout.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:4200")
public class CheckoutController {
    private final CheckoutService checkoutService;

    @PostMapping
    public ResponseEntity<CheckoutResponse> calculateTotal(@RequestBody CheckoutRequest checkoutRequest) {
        Cart cart = new Cart();
        cart.setItems(checkoutRequest.getItems());

        BigDecimal total = checkoutService.calculateTotal(cart);
        return ResponseEntity.ok(new CheckoutResponse(total));
    }
}
