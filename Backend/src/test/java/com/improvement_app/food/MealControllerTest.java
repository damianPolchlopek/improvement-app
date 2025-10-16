package com.improvement_app.food;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static io.restassured.RestAssured.get;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureMockMvc(addFilters = false)
public class MealControllerTest extends AbstractE2ETest {

    @Test
    void shouldReturnMealCategories() {
        // given
//        when(mealManagementUseCase.getAvailableCategories())
//                .thenReturn(List.of("MEAT", "CARBS", "FAT", "SPICES"));

        // when / then
        RestAssured
                .given()
                .accept(ContentType.JSON)
                .when()
                .get("/food/meal/categories")
                .then()
                .statusCode(HttpStatus.OK.value())
                .contentType(ContentType.JSON)
                .body("[0]", org.hamcrest.Matchers.equalTo("All"))
                .body("[1]", org.hamcrest.Matchers.equalTo("Śniadanie"))
                .body("[2]", org.hamcrest.Matchers.equalTo("Obiad"))
                .body("[3]", org.hamcrest.Matchers.equalTo("Ciepły Posiłek"))
                .body("[4]", org.hamcrest.Matchers.equalTo("Słodycze"))
                .body("[5]", org.hamcrest.Matchers.equalTo("Kolacja"));
    }










    @Test
    void shouldCreateAndRetrieveUser() {
        // Tworzenie użytkownika
        String userId = given()
                .contentType(ContentType.JSON)
                .body("""
                        {
                            "name": "Jan Kowalski",
                            "email": "jan.kowalski@example.com"
                        }
                        """)
                .when()
                .post("/users")
                .then()
                .statusCode(201)
                .body("name", equalTo("Jan Kowalski"))
                .body("email", equalTo("jan.kowalski@example.com"))
                .body("id", notNullValue())
                .extract()
                .path("id");

        // Pobieranie użytkownika
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/users/" + userId)
                .then()
                .statusCode(200)
                .body("name", equalTo("Jan Kowalski"))
                .body("email", equalTo("jan.kowalski@example.com"));
    }

    @Test
    void shouldGetAllUsers() {
        // Tworzenie kilku użytkowników
        createUser("Adam Nowak", "adam@example.com");
        createUser("Ewa Wiśniewska", "ewa@example.com");

        // Pobieranie wszystkich użytkowników
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/users")
                .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(2));
    }

    @Test
    void shouldUpdateUser() {
        String userId = createUser("Piotr Zieliński", "piotr@example.com");

        given()
                .contentType(ContentType.JSON)
                .body("""
                        {
                            "name": "Piotr Zieliński Updated",
                            "email": "piotr.updated@example.com"
                        }
                        """)
                .when()
                .put("/users/" + userId)
                .then()
                .statusCode(200)
                .body("name", equalTo("Piotr Zieliński Updated"));
    }

    @Test
    void shouldDeleteUser() {
        String userId = createUser("Maria Lewandowska", "maria@example.com");

        given()
                .when()
                .delete("/users/" + userId)
                .then()
                .statusCode(204);

        given()
                .when()
                .get("/users/" + userId)
                .then()
                .statusCode(404);
    }

    private String createUser(String name, String email) {
        return given()
                .contentType(ContentType.JSON)
                .body(String.format("""
                        {
                            "name": "%s",
                            "email": "%s"
                        }
                        """, name, email))
                .when()
                .post("/users")
                .then()
                .statusCode(201)
                .extract()
                .path("id");
    }

}
