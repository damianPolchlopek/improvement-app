package com.improvement_app.food.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
public class Product{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int kcal;
    private double amount;
    private String unit;
    private int protein;
    private int carbohydrates;
    private int fat;

    public Product(String name) {
        this.name = name;
    }

    public Product() {
    }
}
