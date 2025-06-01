package com.improvement_app.food.ui;

import com.improvement_app.food.application.ProductService;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.ui.response.GetProductResponse;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/food")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/product")
    public Response getProductsRequest(@RequestParam String productCategory,
                                       @RequestParam String productName) {
        ProductCategory productCategoryEnum = ProductCategory.fromValue(productCategory);
        List<GetProductResponse> products = productService.getProducts(productCategoryEnum, productName)
                .stream()
                .map(GetProductResponse::from)
                .toList();
        return Response.ok(products).build();
    }

    @GetMapping("/product/categories")
    public Response getProductsCategories() {
        Object[] entity = Arrays.stream(ProductCategory.values())
                .map(ProductCategory::getName)
                .toArray();
        return Response.ok(entity).build();
    }

}
