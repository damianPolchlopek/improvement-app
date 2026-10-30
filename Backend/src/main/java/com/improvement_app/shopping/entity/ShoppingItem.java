package com.improvement_app.shopping.entity;

import com.improvement_app.audit.basic.AuditableEntity;
import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.shopping.request.ShoppingItemRequest;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "shopping_item", schema = "shopping")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = {"user"})
@ToString(exclude = {"user"})
public class ShoppingItem extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    public static ShoppingItem from(ShoppingItemRequest request, UserEntity user) {
        ShoppingItem shoppingItem = new ShoppingItem();
        shoppingItem.user = user;
        shoppingItem.name = request.name().trim();
        shoppingItem.category = request.category();
        return shoppingItem;
    }
}
