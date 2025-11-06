package com.improvement_app.exceptions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
@Order(Ordered.LOWEST_PRECEDENCE)
public class GlobalExceptionHandler {

    /**
     * Obsługa nieprawidłowych argumentów metod
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        log.warn("Invalid argument provided: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("INVALID_ARGUMENT")
                .message(e.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * Obsługa błędów walidacji request body (@Valid)
     */
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(MethodArgumentNotValidException e) {
//        log.warn("Validation failed for request: {}", e.getBindingResult().getObjectName());
//
//        List<FieldValidationError> fieldErrors = e.getBindingResult()
//                .getFieldErrors()
//                .stream()
//                .map(this::mapToFieldValidationError)
//                .collect(Collectors.toList());
//
//        ValidationErrorResponse errorResponse = ValidationErrorResponse.builder()
//                .code("VALIDATION_FAILED")
//                .message("Request validation failed")
//                .timestamp(LocalDateTime.now())
//                .fieldErrors(fieldErrors)
//                .build();
//
//        return ResponseEntity.badRequest().body(errorResponse);
//    }

    /**
     * Obsługa błędów walidacji parametrów metod (@Min, @Max, etc.)
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ValidationErrorResponse> handleConstraintViolation(ConstraintViolationException e) {
        log.warn("Constraint violation: {}", e.getMessage());

        List<FieldValidationError> fieldErrors = e.getConstraintViolations()
                .stream()
                .map(this::mapToFieldValidationError)
                .collect(Collectors.toList());

        ValidationErrorResponse errorResponse = ValidationErrorResponse.builder()
                .code("CONSTRAINT_VIOLATION")
                .message("Parameter validation failed")
                .timestamp(LocalDateTime.now())
                .fieldErrors(fieldErrors)
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * Obsługa błędów konwersji typów (np. String na Integer)
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        log.warn("Type mismatch for parameter '{}': expected {}, got '{}'",
                e.getName(), e.getRequiredType().getSimpleName(), e.getValue());

        String message = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s",
                e.getValue(), e.getName(), e.getRequiredType().getSimpleName());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("TYPE_MISMATCH")
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * Obsługa nieoczekiwanych błędów
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        log.error("Unexpected runtime error occurred", e);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("INTERNAL_ERROR")
                .message("An unexpected error occurred. Please try again later.")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * Obsługa wszystkich pozostałych wyjątków
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
        log.error("Unexpected error occurred", e);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("INTERNAL_ERROR")
                .message("An internal server error occurred")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    private FieldValidationError mapToFieldValidationError(FieldError fieldError) {
        return FieldValidationError.builder()
                .field(fieldError.getField())
                .rejectedValue(fieldError.getRejectedValue())
                .message(fieldError.getDefaultMessage())
                .build();
    }

    private FieldValidationError mapToFieldValidationError(ConstraintViolation<?> violation) {
        String field = violation.getPropertyPath().toString();
        // Extract field name from property path (e.g., "getDietSummary.id" -> "id")
        if (field.contains(".")) {
            field = field.substring(field.lastIndexOf('.') + 1);
        }

        return FieldValidationError.builder()
                .field(field)
                .rejectedValue(violation.getInvalidValue())
                .message(violation.getMessage())
                .build();
    }
}
