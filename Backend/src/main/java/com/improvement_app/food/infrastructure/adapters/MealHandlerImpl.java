package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.infrastructure.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
@RequiredArgsConstructor
public class MealHandlerImpl implements MealHandler {

    private final MealRepository mealRepository;

    @Override
    public List<MealRecipe> findAll() {
        return mealRepository.findAll();
    }

    @Override
    public void deleteAll() {
        mealRepository.deleteAll();
    }

    @Override
    public List<MealRecipe> saveAll(List<MealRecipe> mealRecipes) {
        for (MealRecipe mealRecipe : mealRecipes) {
            System.out.println("Saving meal recipe: " + mealRecipe.getName() + " with ID: " + mealRecipe.getId());
            mealRepository.save(mealRecipe);
        }

        return null;
    }

    @Override
    public List<MealRecipe> findAllByName(String name, String sortBy) {
        return mealRepository.findAllByName(name, sortBy);
    }

    @Override
    public List<MealRecipe> findAllById(List<Long> ids) {
        return mealRepository.findAllById(ids);
    }
}
