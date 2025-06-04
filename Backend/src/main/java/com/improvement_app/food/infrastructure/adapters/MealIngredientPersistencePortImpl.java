package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.out.MealIngredientPersistencePort;
import com.improvement_app.food.infrastructure.entity.MealIngredientEntity;
import com.improvement_app.food.infrastructure.database.MealIngredientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@Transactional
@RequiredArgsConstructor
public class MealIngredientPersistencePortImpl implements MealIngredientPersistencePort {

    private final MealIngredientRepository mealIngredientRepository;

    @Override
    public List<MealIngredientEntity> getMealIngredients(List<Long> ingredients) {
        return mealIngredientRepository.findAllById(ingredients);
    }
    
}
