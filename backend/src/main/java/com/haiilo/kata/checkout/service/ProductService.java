package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.exception.ProductNotFoundException;
import com.haiilo.kata.checkout.model.Product;
import com.haiilo.kata.checkout.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}

