package com.improvement_app.exceptions;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Podstawowa klasa odpowiedzi błędu
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /**
     * Kod błędu do identyfikacji typu błędu
     */
    private String code;

    /**
     * Czytelny komunikat błędu
     */
    private String message;

    /**
     * Timestamp wystąpienia błędu
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    /**
     * Opcjonalne dodatkowe szczegóły
     */
    private String details;
}
