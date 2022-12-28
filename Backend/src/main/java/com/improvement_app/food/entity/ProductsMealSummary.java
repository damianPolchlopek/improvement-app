package com.improvement_app.food.entity;

import com.improvement_app.food.entity.enums.Unit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class ProductsMealSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int productId;
    private String name;
    private double amount;
    private Unit unit;

    public ProductsMealSummary(int productId, String name, double amount, Unit unit) {
        this.productId = productId;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }
}
