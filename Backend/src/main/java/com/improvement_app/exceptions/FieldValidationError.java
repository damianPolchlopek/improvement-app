package com.improvement_app.exceptions;

import lombok.Builder;

/**
 * @param field         nazwa pola z błędem
 * @param rejectedValue wartość, która została odrzucona
 * @param message       komunikat błędu walidacji
 */
@Builder
public record FieldValidationError(
        String field,
        Object rejectedValue,
        String message
) {
}
