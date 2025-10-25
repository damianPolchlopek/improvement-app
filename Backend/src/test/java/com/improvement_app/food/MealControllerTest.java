package com.improvement_app.food;

import com.improvement_app.food.data.TestDataFactory;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureMockMvc(addFilters = false)
public class MealControllerTest extends AbstractE2ETest {

    @Test
    void shouldReturnMealCategories() throws Exception {
        // given

        // when / then
        String result = RestAssured
                .given()
                .accept(ContentType.JSON)
                .when()
                .get("/food/meal/categories")
                .then()
                .statusCode(HttpStatus.OK.value())
                .contentType(ContentType.JSON)
                .extract()
                .asString();

        // then - wczytaj oczekiwany JSON z pliku i porównaj
        String expectedJson = readResource("expected/food/meal_categories.json");

        JSONAssert.assertEquals(expectedJson, result, true);
    }

    @Test
    void shouldReturnMealTypes() throws Exception {
        // given - (opcjonalnie przygotuj mocki jeśli potrzebne)

        // when
        String responseBody = RestAssured
                .given()
                .accept(ContentType.JSON)
                .when()
                .get("/food/meal/types")
                .then()
                .statusCode(HttpStatus.OK.value())
                .contentType(ContentType.JSON)
                .extract()
                .asString();

        // then - wczytaj oczekiwany JSON z pliku i porównaj
        String expectedJson = readResource("expected/food/meal_types.json");

        // strict = true -> musi być dokładna zgodność (wartości i kolejność)
        // jeśli nie chcesz wymagać kolejności lub dopuszczać dodatkowych pól ustaw false
        JSONAssert.assertEquals(expectedJson, responseBody, true);
    }

    @Test
    void shouldReturnSortedMealIngredients() throws Exception {
        // given
        TestDataFactory.TestDataGenerator testData = TestDataFactory.generator(
                productRepository,
                mealRecipeRepository,
                dietSummaryRepository,
                userRepository
        );

        testData
            .withUser()
            .withProducts(20)              // 1. Najpierw produkty
            .withMealRecipes(10, 5); // 2. Potem przepisy z produktami

        // when
        String responseBody = RestAssured
                .given()
                .accept(ContentType.JSON)
                .when()
                .get("/food/meal/34/ingredients")
                .then()
                .statusCode(HttpStatus.OK.value())
                .contentType(ContentType.JSON)
                .extract()
                .asString();

        // then
        String expectedJson = readResource("expected/food/meal_ingredients.json");
        JSONAssert.assertEquals(expectedJson, responseBody, true);
    }

    @Test
    void shouldReturnMeals() throws Exception {
        // given
        TestDataFactory.TestDataGenerator testData = TestDataFactory.generator(
                productRepository,
                mealRecipeRepository,
                dietSummaryRepository,
                userRepository
        );

        testData
            .withUser()
            .withProducts(20)
            .withMealRecipes(10, 5);

        // when
        String responseBody = RestAssured
                .given()
                    .param("mealName", "")
                    .param("mealCategory", "ALL")
                    .param("mealType", "ALL")
                    .param("mealPopularity", "ALL")
                    .param("sortBy", "name")
                    .param("onOnePortion", "false")
                    .accept(ContentType.JSON)
                .when()
                    .get("/food/meal")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .contentType(ContentType.JSON)
                    .extract()
                    .asString();

        // then
        String expectedJson = readResource("expected/food/meal_search.json");
        JSONAssert.assertEquals(expectedJson, responseBody, true);
    }

}
