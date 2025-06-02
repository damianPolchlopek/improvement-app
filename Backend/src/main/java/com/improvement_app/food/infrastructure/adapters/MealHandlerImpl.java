package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.infrastructure.database.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
        return mealRepository.saveAll(mealRecipes);
    }

    @Override
    public List<MealRecipe> findAll(Specification<MealRecipe> spec, Sort sort) {
        return mealRepository.findAll(spec, sort);
    }

}
