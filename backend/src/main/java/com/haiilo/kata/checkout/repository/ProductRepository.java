package com.haiilo.kata.checkout.repository;

import com.haiilo.kata.checkout.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

}
