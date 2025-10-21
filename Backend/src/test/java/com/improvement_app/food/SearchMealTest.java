package com.improvement_app.food;

import com.improvement_app.food.data.TestDataFactory;
import com.improvement_app.food.infrastructure.database.MealRecipeRepository;
import com.improvement_app.food.infrastructure.entity.MealRecipeEntity;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

public class SearchMealTest extends AbstractE2ETest {

    @Autowired
    private MealRecipeRepository mealRecipeRepository;

//    @Test
//    void shouldReturnMealSearch() throws Exception {
//        MealRecipeEntity mealRecipeEntity = TestDataFactory.mealRecipeBuilder();
//
//        mealRecipeRepository.save(mealRecipeEntity);
//
//        System.out.println("Meal: " + mealRecipeEntity);
//
//
//
//        String responseBody = RestAssured
//                .given()
//                .accept(ContentType.JSON)
//                .when()
//                .get("/food/meal/types")
//                .then()
//                .statusCode(HttpStatus.OK.value())
//                .contentType(ContentType.JSON)
//                .extract()
//                .asString();
//
//
//
//
//    }
//
//

}
