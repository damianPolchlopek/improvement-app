package com.improvement_app.security.entity;

import java.time.Duration;

public enum TokenTypeEnum {

    EMAIL_VERIFICATION(Duration.ofHours(24)),
    PASSWORD_RESET(Duration.ofHours(1));

    private final Duration defaultValidity;

    TokenTypeEnum(Duration defaultValidity) {
        this.defaultValidity = defaultValidity;
    }

    /**
     * Get default validity duration for this token type
     * @return default validity duration
     */
    public Duration getDefaultValidity() {
        return defaultValidity;
    }

}
