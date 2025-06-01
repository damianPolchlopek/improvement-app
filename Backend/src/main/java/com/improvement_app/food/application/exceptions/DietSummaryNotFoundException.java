package com.improvement_app.food.application.exceptions;

/**
 * Wyjątek dla błędów nie znalezienia podsumowania diety
 */
public class DietSummaryNotFoundException extends RuntimeException {

    public DietSummaryNotFoundException(String message) {
        super(message);
    }

    public DietSummaryNotFoundException(Long id) {
        super("Diet summary not found with id: " + id);
    }

    public DietSummaryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}