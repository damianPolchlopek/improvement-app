package com.improvement_app.food.repository;

import com.improvement_app.food.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {

    @Query("SELECT m FROM Meal m WHERE LOWER(m.name) LIKE %:mealName% ORDER BY m.name")
    List<Meal> findAllByName(String mealName);

    @Query("SELECT m FROM Meal m WHERE LOWER(m.name) LIKE %:mealName% ORDER BY m.category, m.type")
    List<Meal> findAllByCategory(String mealName);
}
