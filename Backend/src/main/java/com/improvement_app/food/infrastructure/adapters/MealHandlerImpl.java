package com.improvement_app.food.infrastructure.adapters;

import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.domain.Meal;
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
    public List<Meal> findAll() {
        return mealRepository.findAll();
    }

    @Override
    public void deleteAll() {
        mealRepository.deleteAll();
    }

    @Override
    public List<Meal> saveAll(List<Meal> meals) {
        return mealRepository.saveAll(meals);
    }

    @Override
    public List<Meal> findAllByName(String name, String sortBy) {
        return mealRepository.findAllByName(name, sortBy);
    }

    @Override
    public List<Meal> findAllById(List<Long> ids) {
        return mealRepository.findAllById(ids);
    }
}
