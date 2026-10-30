package com.improvement_app.shopping.request;

import com.improvement_app.shopping.entity.Category;
import jakarta.validation.constraints.AssertFalse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ShoppingItemRequest(
        @NotBlank @Size(max = 255) String name,
        @NotNull Category category
) {
    // "ALL" to tylko filtr listy, nie prawdziwa kategoria produktu
    @AssertFalse(message = "Category 'ALL' cannot be assigned to an item")
    public boolean isCategoryAll() {
        return category == Category.ALL;
    }
}
