package com.improvement_app.food.ui;

import com.improvement_app.food.application.ProductService;
import com.improvement_app.food.domain.enums.ProductCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.Response;
import java.util.Arrays;

@RestController
@RequiredArgsConstructor
@RequestMapping("/food")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/product")
    public Response getProductsRequest(@RequestParam String productCategory,
                                       @RequestParam String productName) {
        ProductCategory productCategoryEnum = ProductCategory.fromValue(productCategory);
        return Response.ok(productService.getProducts(productCategoryEnum, productName)).build();
    }

    @GetMapping("/product/categories")
    public Response getProductsCategories() {
        return Response.ok(Arrays.stream(ProductCategory.values())
                .map(ProductCategory::getName)
                .toArray()).build();
    }

}
