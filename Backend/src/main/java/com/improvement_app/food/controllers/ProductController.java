package com.improvement_app.food.controllers;

import com.improvement_app.food.entity.Product;
import com.improvement_app.food.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/diet")
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductService productService;

    @GetMapping("/product")
    public void qqq() {
        Product product = new Product("Damian");
        productRepository.save(product);
    }

    @GetMapping("/show")
    public List<Product> qqw() {
        return productRepository.findAll();
    }

    @GetMapping("/initProducts")
    public void initProducts() {
        productRepository.deleteAll();
    }

    @GetMapping("/parse")
    public List<Product> qqqqq() throws IOException {
        return productService.initProducts();
    }

}
