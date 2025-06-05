//package com.improvement_app.food;
//
//import com.improvement_app.food.domain.DietSummary;
//import com.improvement_app.food.infrastructure.entity.EatenMeal;
//import com.improvement_app.food.infrastructure.database.DietSummaryRepository;
//import com.improvement_app.food.ui.requests.CalculateDietRequest;
//import com.improvement_app.food.ui.requests.CreateDietSummaryRequest;
//import com.improvement_app.food.ui.requests.RecalculateMealMacroRequest;
//import com.improvement_app.food.ui.requests.UpdateDietSummaryRequest;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.web.client.TestRestTemplate;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.transaction.annotation.Transactional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.concurrent.CountDownLatch;
//import java.util.concurrent.ExecutorService;
//import java.util.concurrent.Executors;
//import java.util.concurrent.TimeUnit;
//import java.util.concurrent.atomic.AtomicInteger;
//
//@ActiveProfiles("test")
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//@TestPropertySource(properties = {
//        "spring.datasource.url=jdbc:h2:mem:testdb",
//        "spring.jpa.hibernate.ddl-auto=create-drop"
//})
//@Transactional
//class DietSummaryE2ETest {
//
//    @Autowired
//    private TestRestTemplate restTemplate;
//
//    @Autowired
//    private DietSummaryRepository dietSummaryRepository;
//
//    @Test
//    void shouldCreateRetrieveUpdateAndDeleteDietSummary() {
//        // 1. Create diet summary
//        List<EatenMeal> meals = createSampleMeals();
//        CreateDietSummaryRequest createRequest = new CreateDietSummaryRequest(meals);
//
//        ResponseEntity<DietSummary> createResponse = restTemplate.postForEntity(
//                "/food/diet/day-summary",
//                createRequest,
//                DietSummary.class
//        );
//
//        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
//        assertThat(createResponse.getBody()).isNotNull();
//        assertThat(createResponse.getBody().id()).isNotNull();
//        Long createdId = createResponse.getBody().id();
//
//        // 2. Retrieve created diet summary
//        ResponseEntity<DietSummary> getResponse = restTemplate.getForEntity(
//                "/food/diet/day-summary/" + createdId,
//                DietSummary.class
//        );
//
//        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(getResponse.getBody()).isNotNull();
//        assertThat(getResponse.getBody().id()).isEqualTo(createdId);
//        assertThat(getResponse.getBody().kcal()).isEqualTo(800.0);
//
//        // 3. Update diet summary
//        List<EatenMeal> updatedMeals = createUpdatedMeals();
//        UpdateDietSummaryRequest updateRequest = new UpdateDietSummaryRequest(createdId, updatedMeals);
//
//        ResponseEntity<DietSummary> updateResponse = restTemplate.exchange(
//                "/food/diet/day-summary",
//                HttpMethod.PUT,
//                new HttpEntity<>(updateRequest),
//                DietSummary.class
//        );
//
//        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(updateResponse.getBody()).isNotNull();
//        assertThat(updateResponse.getBody().kcal()).isEqualTo(1000.0); // Updated value
//
//        // 4. Get paginated list
//        ResponseEntity<PageResponse> listResponse = restTemplate.getForEntity(
//                "/food/diet/day-summary?page=0&size=10",
//                PageResponse.class
//        );
//
//        assertThat(listResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(listResponse.getBody()).isNotNull();
//        assertThat(listResponse.getBody().getTotalElements()).isGreaterThan(0);
//
//        // 5. Delete diet summary
//        ResponseEntity<Void> deleteResponse = restTemplate.exchange(
//                "/food/diet/day-summary/" + createdId,
//                HttpMethod.DELETE,
//                null,
//                Void.class
//        );
//
//        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
//
//        // 6. Verify deletion
//        ResponseEntity<DietSummary> getDeletedResponse = restTemplate.getForEntity(
//                "/food/diet/day-summary/" + createdId,
//                DietSummary.class
//        );
//
//        assertThat(getDeletedResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
//    }
//
//    @Test
//    void shouldCalculateDietSummaryWithoutSaving() {
//        // given
//        List<EatenMeal> meals = createSampleMeals();
//        CalculateDietRequest request = new CalculateDietRequest(meals);
//
//        // when
//        ResponseEntity<DietSummary> response = restTemplate.postForEntity(
//                "/food/diet/calculate",
//                request,
//                DietSummary.class
//        );
//
//        // then
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(response.getBody()).isNotNull();
//        assertThat(response.getBody().kcal()).isEqualTo(800.0);
//        assertThat(response.getBody().id()).isNull(); // Not saved to database
//
//        // Verify nothing was saved to database
//        long countBefore = dietSummaryRepository.count();
//        assertThat(countBefore).isEqualTo(0);
//    }
//
//    @Test
//    void shouldRecalculateMealMacro() {
//        // given
//        EatenMeal meal = new EatenMeal(1L, "Test Meal", 300.0, 20.0, 30.0, 10.0);
//        RecalculateMealMacroRequest request = new RecalculateMealMacroRequest(meal);
//
//        // when
//        ResponseEntity<EatenMeal> response = restTemplate.postForEntity(
//                "/food/diet/meal/recalculate",
//                request,
//                EatenMeal.class
//        );
//
//        // then
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(response.getBody()).isNotNull();
//        assertThat(response.getBody().id()).isEqualTo(1L);
//    }
//
//    @Test
//    void shouldHandleValidationErrors() {
//        // given - invalid request with negative page
//        String invalidUrl = "/food/diet/day-summary?page=-1&size=0";
//
//        // when
//        ResponseEntity<String> response = restTemplate.getForEntity(invalidUrl, String.class);
//
//        // then
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
//    }
//
//    @Test
//    void shouldReturn404ForNonExistentDietSummary() {
//        // when
//        ResponseEntity<String> response = restTemplate.getForEntity(
//                "/food/diet/day-summary/999999",
//                String.class
//        );
//
//        // then
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
//    }
//
//    @Test
//    void shouldHandleConcurrentOperations() throws InterruptedException {
//        // given
//        List<EatenMeal> meals = createSampleMeals();
//        CreateDietSummaryRequest createRequest = new CreateDietSummaryRequest(meals);
//
//        // Create initial diet summary
//        ResponseEntity<DietSummary> createResponse = restTemplate.postForEntity(
//                "/food/diet/day-summary",
//                createRequest,
//                DietSummary.class
//        );
//        Long dietId = createResponse.getBody().id();
//
//        // when - simulate concurrent updates
//        ExecutorService executor = Executors.newFixedThreadPool(3);
//        CountDownLatch latch = new CountDownLatch(3);
//        AtomicInteger successCount = new AtomicInteger(0);
//
//        for (int i = 0; i < 3; i++) {
//            final int threadNum = i;
//            executor.submit(() -> {
//                try {
//                    List<EatenMeal> threadMeals = createMealsForThread(threadNum);
//                    UpdateDietSummaryRequest updateRequest = new UpdateDietSummaryRequest(dietId, threadMeals);
//
//                    ResponseEntity<DietSummary> response = restTemplate.exchange(
//                            "/food/diet/day-summary",
//                            HttpMethod.PUT,
//                            new HttpEntity<>(updateRequest),
//                            DietSummary.class
//                    );
//
//                    if (response.getStatusCode().is2xxSuccessful()) {
//                        successCount.incrementAndGet();
//                    }
//                } catch (Exception e) {
//                    // Expected in concurrent scenarios
//                } finally {
//                    latch.countDown();
//                }
//            });
//        }
//
//        latch.await(10, TimeUnit.SECONDS);
//        executor.shutdown();
//
//        // then - at least one update should succeed
//        assertThat(successCount.get()).isGreaterThan(0);
//    }
//
//    @Test
//    void shouldMaintainDataConsistency() {
//        // given
//        List<EatenMeal> meals = List.of(
//                new EatenMeal(1L, "Breakfast", 400.0, 25.0, 40.0, 15.0),
//                new EatenMeal(2L, "Lunch", 600.0, 40.0, 50.0, 20.0)
//        );
//        CreateDietSummaryRequest createRequest = new CreateDietSummaryRequest(meals);
//
//        // when
//        ResponseEntity<DietSummary> response = restTemplate.postForEntity(
//                "/food/diet/day-summary",
//                createRequest,
//                DietSummary.class
//        );
//
//        // then
//        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
//        DietSummary created = response.getBody();
//
//        // Verify calculations are consistent
//        double expectedKcal = meals.stream().mapToDouble(EatenMeal::kcal).sum();
//        double expectedProtein = meals.stream().mapToDouble(EatenMeal::protein).sum();
//        double expectedCarbs = meals.stream().mapToDouble(EatenMeal::carbohydrates).sum();
//        double expectedFat = meals.stream().mapToDouble(EatenMeal::fat).sum();
//
//        assertThat(created.kcal()).isEqualTo(expectedKcal);
//        assertThat(created.protein()).isEqualTo(expectedProtein);
//        assertThat(created.carbohydrates()).isEqualTo(expectedCarbs);
//        assertThat(created.fat()).isEqualTo(expectedFat);
//        assertThat(created.date()).isEqualTo(LocalDate.now());
//        assertThat(created.meals()).hasSize(2);
//    }
//
//    // Helper methods
//    private List<EatenMeal> createSampleMeals() {
//        return List.of(
//                new EatenMeal(1L, "Breakfast", 300.0, 20.0, 30.0, 10.0),
//                new EatenMeal(2L, "Lunch", 500.0, 35.0, 40.0, 15.0)
//        );
//    }
//
//    private List<EatenMeal> createUpdatedMeals() {
//        return List.of(
//                new EatenMeal(1L, "Updated Breakfast", 400.0, 25.0, 35.0, 12.0),
//                new EatenMeal(2L, "Updated Lunch", 600.0, 40.0, 45.0, 18.0)
//        );
//    }
//
//    private List<EatenMeal> createMealsForThread(int threadNum) {
//        return List.of(
//                new EatenMeal(1L, "Thread " + threadNum + " Breakfast", 300.0 + threadNum * 10, 20.0, 30.0, 10.0),
//                new EatenMeal(2L, "Thread " + threadNum + " Lunch", 500.0 + threadNum * 20, 35.0, 40.0, 15.0)
//        );
//    }
//
//    // Helper class for paginated responses
//    public static class PageResponse {
//        private List<Object> content;
//        private int totalElements;
//        private int totalPages;
//        private int size;
//        private int number;
//
//        // getters and setters
//        public List<Object> getContent() { return content; }
//        public void setContent(List<Object> content) { this.content = content; }
//        public int getTotalElements() { return totalElements; }
//        public void setTotalElements(int totalElements) { this.totalElements = totalElements; }
//        public int getTotalPages() { return totalPages; }
//        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
//        public int getSize() { return size; }
//        public void setSize(int size) { this.size = size; }
//        public int getNumber() { return number; }
//        public void setNumber(int number) { this.number = number; }
//    }
//}