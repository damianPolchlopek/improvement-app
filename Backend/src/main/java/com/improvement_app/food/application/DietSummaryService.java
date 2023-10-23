package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.DietSummaryHandler;
import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.ui.dto.DietSummaryDto;
import com.improvement_app.food.ui.dto.MealDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DietSummaryService {

    private final DietSummaryHandler dietSummaryHandler;

    @Transactional
    public DietSummary addDietSummary(DietSummaryDto dietSummaryDto) {
        DietSummary dietSummary = DietSummary.from(dietSummaryDto);
        return dietSummaryHandler.save(dietSummary);
    }

    @Transactional
    public List<MealIngredient> getProducts(List<MealDto> mealDtos) {
        // usuniecie zerowych wystapien
        List<MealDto> meals = mealDtos.stream().filter(meal -> meal.getAmount() != 0).toList();

        // dodanie wielekrotnosc skladnikow gdy amount > 1
        List<MealIngredient> allIngredients = new ArrayList<>();
        for (MealDto mealDto: meals) {
            for (int i = 0; i < mealDto.getAmount(); i++) {
                allIngredients.addAll(mealDto.getMealIngredients());
            }
        }

        // grupowanie produktami
        Map<String, List<MealIngredient>> groupingIngredients = allIngredients.stream().collect(Collectors.groupingBy(MealIngredient::getName));

        // TODO: dodac obslugie roznych unitow: łyzeczka/gram itp.
        // sumowanie list składników
        List<MealIngredient> result = new ArrayList<>();
        for (Map.Entry<String, List<MealIngredient>> singleMealIngredient: groupingIngredients.entrySet()){
            List<MealIngredient> values = singleMealIngredient.getValue();

            MealIngredient mealIngredient = values.get(0);
            MealIngredient resMealIngredient = new MealIngredient(mealIngredient);
            for (int i = 1; i < values.size(); i++) {
                resMealIngredient.setAmount(
                        resMealIngredient.getAmount() + values.get(i).getAmount()
                );
            }

            result.add(resMealIngredient);
        }

        List<MealIngredient> collect = result.stream()
                .sorted(Comparator.comparing(MealIngredient::getName))
                .collect(Collectors.toList());

//        System.out.println("------------------");
//        for (MealIngredient sss : collect) {
//            System.out.println("Product: " + sss.getName() + ", unit: " + sss.getUnit() + ", amount: " + sss.getAmount());
//        }

        return collect;
    }
}
