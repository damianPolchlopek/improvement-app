package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.infrastructure.entity.MealRecipeEntity;
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
    public List<MealRecipeEntity> findAll() {
        return mealRepository.findAll();
    }

    @Override
    public void deleteAll() {
        mealRepository.deleteAll();
    }

    @Override
    public List<MealRecipeEntity> saveAll(List<MealRecipeEntity> mealRecipeEntities) {
        return mealRepository.saveAll(mealRecipeEntities);
    }

    @Override
    public List<MealRecipeEntity> findAll(Specification<MealRecipeEntity> spec, Sort sort) {
        return mealRepository.findAll(spec, sort);
    }

}
