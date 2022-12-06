//package com.improvement_app.food.controllers;
//
//import com.improvement_app.food.entity.Meal;
//import com.improvement_app.food.entity.Product;
//import com.improvement_app.food.repository.MealRepository;
//import com.improvement_app.food.repository.ProductRepository;
//import com.improvement_app.food.services.FoodService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.ws.rs.core.Response;
//import java.io.IOException;
//import java.util.List;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/food")
//public class FoodController {
//
//    private final ProductRepository productRepository;
//    private final MealRepository mealRepository;
//    private final FoodService foodService;
//
//    @GetMapping("/getProducts")
//    public Response getProducts() {
//        return Response.ok(productRepository.findAll()).build();
//    }
//
//
//    @GetMapping("/getMeals")
//    public Response getMeals() {
//        return Response.ok(mealRepository.findAll()).build();
//    }
//
//
//
//
//
//    // DEBUG functions
//
//    @GetMapping("/product")
//    public void getProducts2() {
//        Product product = new Product("Damian");
//        productRepository.save(product);
//    }
//
//    @GetMapping("/getProduct2")
//    public List<Product> getProducts3() {
//        return productRepository.findAll();
//    }
//
//    @GetMapping("/initMeals")
//    public List<Meal> initMeals() throws IOException {
//        foodService.initMeals();
//        return null;
//    }
//}
