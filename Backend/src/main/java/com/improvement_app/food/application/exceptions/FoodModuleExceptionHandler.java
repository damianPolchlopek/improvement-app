package com.improvement_app.food.application.exceptions;

import com.improvement_app.exceptions.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@Slf4j
@ControllerAdvice
@Order(1)
public class FoodModuleExceptionHandler {

    /**
     * Obsługa wyjątku gdy nie znaleziono podsumowania diety
     */
    @ExceptionHandler(DietSummaryNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleDietSummaryNotFound(DietSummaryNotFoundException e) {
        log.warn("Diet summary not found: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("DIET_SUMMARY_NOT_FOUND")
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
}
