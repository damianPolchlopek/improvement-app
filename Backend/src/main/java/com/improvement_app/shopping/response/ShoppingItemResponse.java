package com.improvement_app.shopping.response;

import com.improvement_app.shopping.entity.Category;
import com.improvement_app.shopping.entity.ShoppingItem;

public record ShoppingItemResponse(
        Long id,
        String name,
        Category category
) {
    public static ShoppingItemResponse from(ShoppingItem shoppingItem) {
        return new ShoppingItemResponse(
                shoppingItem.getId(),
                shoppingItem.getName(),
                shoppingItem.getCategory()
        );
    }
}
