package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.MealIngredientHandler;
import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.infrastructure.database.MealIngredientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@Transactional
@RequiredArgsConstructor
public class MealIngredientHandlerImpl implements MealIngredientHandler {

    private final MealIngredientRepository mealIngredientRepository;

    @Override
    public List<MealIngredient> getMealIngredients(List<Long> ingredients) {
        return mealIngredientRepository.findAllById(ingredients);
    }
    
}
