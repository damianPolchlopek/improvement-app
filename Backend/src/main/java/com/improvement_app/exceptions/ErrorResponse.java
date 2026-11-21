package com.improvement_app.exceptions;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Podstawowa klasa odpowiedzi błędu
 *
 * @param code      kod błędu do identyfikacji typu błędu
 * @param message   czytelny komunikat błędu
 * @param timestamp timestamp wystąpienia błędu
 * @param details   opcjonalne dodatkowe szczegóły
 */
@Builder
public record ErrorResponse(
        String code,
        String message,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime timestamp,
        String details
) {
}
