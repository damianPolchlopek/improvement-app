package com.improvement_app.shopping.service;

import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.security.repository.UserRepository;
import com.improvement_app.shopping.entity.Category;
import com.improvement_app.shopping.entity.ShoppingItem;
import com.improvement_app.shopping.repository.ShoppingItemRepository;
import com.improvement_app.shopping.request.ShoppingItemRequest;
import com.improvement_app.shopping.response.ShoppingItemResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class ShoppingService {

    private final ShoppingItemRepository shoppingItemRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ShoppingItemResponse> getShoppingItems(Long userId, Category category) {
        List<ShoppingItem> items = category == Category.ALL
                ? shoppingItemRepository.findByUserIdOrderByCategoryAscIdDesc(userId)
                : shoppingItemRepository.findByUserIdAndCategoryOrderByIdDesc(userId, category);

        return items.stream()
                .map(ShoppingItemResponse::from)
                .toList();
    }

    @Transactional
    public ShoppingItemResponse addShoppingItem(Long userId, ShoppingItemRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        ShoppingItem saved = shoppingItemRepository.save(ShoppingItem.from(request, user));
        return ShoppingItemResponse.from(saved);
    }

    // Cudzy produkt traktujemy jak nieistniejący — nie zdradzamy, że takie id jest w bazie
    @Transactional
    public void deleteShoppingItem(Long userId, Long id) {
        ShoppingItem shoppingItem = shoppingItemRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shopping item not found: " + id));
        shoppingItemRepository.delete(shoppingItem);
    }

}
