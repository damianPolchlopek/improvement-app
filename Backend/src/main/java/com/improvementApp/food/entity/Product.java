package com.improvementApp.food.entity;

import lombok.Data;

@Data
public class Product{
    private int id;
    private String name;
    private int kcal;
    private double amount;
    private String unit;
    private int protein;
    private int carbohydrates;
    private int fat;

}
