//package com.improvement_app;
//
//import com.improvement_app.food.application.CalculationMacroelementsService;
//import org.mockito.Mockito;
//import org.springframework.boot.test.context.TestConfiguration;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Primary;
//
//import java.time.Clock;
//import java.time.Instant;
//import java.time.ZoneId;
//
//@TestConfiguration
//public class TestConfig {
//
//    @Bean
//    @Primary
//    public Clock testClock() {
//        return Clock.fixed(Instant.parse("2024-01-15T10:00:00Z"), ZoneId.systemDefault());
//    }
//
//    @Bean
//    @Primary
//    public CalculationMacroelementsService mockCalculationService() {
//        return Mockito.mock(CalculationMacroelementsService.class);
//    }
//}
//
