package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.MealIngredientHandler;
import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.infrastructure.MealIngredientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
@Transactional
@RequiredArgsConstructor
public class MealIngredientHandlerImpl implements MealIngredientHandler {

    private final MealIngredientRepository mealIngredientRepository;

    @Override
    public Optional<MealIngredient> getMealIngredient(int id) {
        return mealIngredientRepository.findById((long) id);
    }
}
