package com.improvement_app.workouts.exceptions;

import com.improvement_app.exceptions.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
@Order(2)
public class TrainingExceptionsHandler {

    /**
     * Obsługa błędów związanych z nieznalezionymi ćwiczeniami
     */
    @ExceptionHandler(ExercisesNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleExercisesNotFound(ExercisesNotFoundException ex) {
        log.warn("Exercises not found: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("EXERCISES_NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * Obsługa błędów związanych z nieznalezionymi szablonami treningów
     */
    @ExceptionHandler(TrainingTemplateNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTrainingTemplateNotFound(TrainingTemplateNotFoundException ex) {
        log.warn("Training template not found: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("TRAINING_TEMPLATE_NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * Obsługa błędów związanych z nieznalezionymi typami ćwiczeń
     */
    @ExceptionHandler(ExerciseTypeNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleExerciseTypeNotFound(ExerciseTypeNotFoundException ex) {
        log.warn("Exercise type not found: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("EXERCISE_TYPE_NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * Obsługa błędów związanych z niemożnością utworzenia pliku
     */
    @ExceptionHandler(FileNotCreatedException.class)
    public ResponseEntity<ErrorResponse> handleFileNotCreated(FileNotCreatedException ex) {
        log.error("File could not be created: {}", ex.getMessage(), ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("FILE_CREATION_FAILED")
                .message("Failed to create file: " + ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * Obsługa błędów związanych z nieznalezionymi plikami
     */
    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleFileNotFound(FileNotFoundException ex) {
        log.warn("File not found: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("FILE_NOT_FOUND")
                .message("File not found: " + ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(ExcelFileParseException.class)
    public ResponseEntity<ErrorResponse> handleParseException(ExcelFileParseException ex) {
        log.warn("Parse exception: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code("FILE_ERROR")
                .message("Parse exception: " + ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }


}