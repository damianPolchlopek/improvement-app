package com.improvement_app.exceptions;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldValidationError {

    /**
     * Nazwa pola z błędem
     */
    private String field;

    /**
     * Wartość która została odrzucona
     */
    private Object rejectedValue;

    /**
     * Komunikat błędu walidacji
     */
    private String message;
}

