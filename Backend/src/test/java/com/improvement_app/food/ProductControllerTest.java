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
public class ProductControllerTest extends AbstractE2ETest {

    @Test
    void shouldReturnProductCategories() throws Exception {
        // given

        // when / then
        String result = RestAssured
                .given()
                .accept(ContentType.JSON)
                .when()
                .get("/food/product/categories")
                .then()
                .statusCode(HttpStatus.OK.value())
                .contentType(ContentType.JSON)
                .extract()
                .asString();

        // then - wczytaj oczekiwany JSON z pliku i porównaj
        String expectedJson = readResource("expected/food/product_categories.json");

        JSONAssert.assertEquals(expectedJson, result, true);
    }

    @Test
    void shouldReturnProducts() throws Exception {
        //given
        TestDataFactory.TestDataGenerator testData = TestDataFactory.generator(
                productRepository,
                mealRecipeRepository,
                dietSummaryRepository,
                userRepository
        );

        testData
                .withProducts(50);

        // when
        String result = RestAssured
                .given()
                    .accept(ContentType.JSON)
                .when()
                    .param("productName", "")
                    .param("productCategory", "Mięso")
                    .get("/food/product")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .contentType(ContentType.JSON)
                    .extract()
                .asString();

        // then - wczytaj oczekiwany JSON z pliku i porównaj
        String expectedJson = readResource("expected/food/product_search.json");
        JSONAssert.assertEquals(expectedJson, result, true);

        testData.cleanUp();
    }

}
