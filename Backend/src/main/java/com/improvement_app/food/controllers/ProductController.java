package com.improvement_app.food.controllers;

import com.improvement_app.food.entity.Product;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/diet")
public class ProductController {

    ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/product")
    public void qqq(){
        Product product = new Product("Damian");
        productRepository.save(product);
        System.out.println("hello");
    }

    @GetMapping("/show")
    public List<Product> qqw(){
        return productRepository.findAll();
    }


}
