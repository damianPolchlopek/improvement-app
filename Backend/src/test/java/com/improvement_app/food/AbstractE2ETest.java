//package com.improvement_app.food;
//
//import com.improvement_app.food.config.PermitAllSecurityConfig;
//import com.improvement_app.food.config.TestContainersConfiguration;
//import com.improvement_app.food.data.TestDataFactory;
//import com.improvement_app.food.infrastructure.repository.DietSummaryRepository;
//import com.improvement_app.food.infrastructure.repository.MealRecipeRepository;
//import com.improvement_app.food.infrastructure.repository.ProductRepository;
//import com.improvement_app.security.repository.UserRepository;
//import io.restassured.RestAssured;
//import org.junit.jupiter.api.BeforeEach;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.web.server.LocalServerPort;
//import org.springframework.context.annotation.Import;
//import org.springframework.test.context.ActiveProfiles;
//
//import java.io.IOException;
//import java.nio.charset.StandardCharsets;
//import java.util.Objects;
//
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//@Import(value = {TestContainersConfiguration.class, PermitAllSecurityConfig.class})
//@ActiveProfiles("test")
//@AutoConfigureMockMvc(addFilters = false)
//public abstract class AbstractE2ETest {
//
//    @Autowired
//    protected MealRecipeRepository mealRecipeRepository;
//    @Autowired
//    protected ProductRepository productRepository;
//    @Autowired
//    protected DietSummaryRepository dietSummaryRepository;
//    @Autowired
//    protected UserRepository userRepository;
//
//    @LocalServerPort
//    protected int port;
//
//    @BeforeEach
//    void setUp() {
//        RestAssured.port = port;
////        RestAssured.basePath = "/api";
//        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
//
//        TestDataFactory.resetFaker();
//    }
//
//    String readResource(String path) throws IOException {
//        try (var is = Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream(path))) {
//            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
//        }
//    }
//}
