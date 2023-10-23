package com.improvement_app.food.infrastructure;

import com.improvement_app.food.domain.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {

    @Query("SELECT m FROM Meal m WHERE LOWER(m.name) LIKE %:mealName% ORDER BY "
            + "CASE WHEN :order = 'category' THEN m.category ELSE m.name END")
    List<Meal> findAllByName(String mealName, String order);

}
