package com.improvement_app.food.controllers;

import com.improvement_app.food.entity.Meal;
import com.improvement_app.food.entity.Product;
import com.improvement_app.food.services.MealService;
import com.improvement_app.food.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/food")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/getProducts")
    public Response getProducts() {
        return Response.ok(productService.getProducts()).build();
    }

    @GetMapping("/getProductCategories")
    public Response getProductsCategories() throws IOException {
        return Response.ok(productService.getProductCategories()).build();
    }






    // DEBUG functions

    @GetMapping("/product")
    public void getProducts2() {
        Product product = new Product("Damian");
        productService.saveProduct(product);
    }

    @GetMapping("/getProduct2")
    public List<Product> getProducts3() {
        return productService.getProducts();
    }

}
