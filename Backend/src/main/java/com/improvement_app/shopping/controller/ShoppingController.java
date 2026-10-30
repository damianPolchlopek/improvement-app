package com.improvement_app.shopping.controller;

import com.improvement_app.common.web.ApiVersions;
import com.improvement_app.shopping.entity.Category;
import com.improvement_app.shopping.request.ShoppingItemRequest;
import com.improvement_app.shopping.response.ShoppingItemResponse;
import com.improvement_app.shopping.service.ShoppingService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(ApiVersions.V1 + "/shopping")
public class ShoppingController {

    private final ShoppingService shoppingService;

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ShoppingItemResponse>> getShoppingItems(
            @PathVariable Category category,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        return ResponseEntity.ok(shoppingService.getShoppingItems(userId, category));
    }

    @GetMapping("/categories")
    public ResponseEntity<Category[]> getAllCategoryType() {
        return ResponseEntity.ok(Category.values());
    }

    @PostMapping("/")
    public ResponseEntity<ShoppingItemResponse> addShoppingItem(
            @Valid @RequestBody ShoppingItemRequest request,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        ShoppingItemResponse savedItem = shoppingService.addShoppingItem(userId, request);
        return ResponseEntity.ok(savedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShoppingItem(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "id") Long userId
    ) {
        shoppingService.deleteShoppingItem(userId, id);
        return ResponseEntity.noContent().build();
    }

}
