package com.improvement_app.shopping.repository;

import com.improvement_app.shopping.entity.Category;
import com.improvement_app.shopping.entity.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {

    List<ShoppingItem> findByUserIdOrderByCategoryAscIdDesc(Long userId);

    List<ShoppingItem> findByUserIdAndCategoryOrderByIdDesc(Long userId, Category category);

    Optional<ShoppingItem> findByIdAndUserId(Long id, Long userId);

}
