package com.improvement_app.common.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.ZoneId;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditFieldChange {
    private String fieldName;
    private Object oldValue;
    private Object newValue;
    private String fieldType;

    public String getChangeDescription() {
        return String.format("%s (%s): %s → %s",
                fieldName, fieldType,
                formatValue(oldValue),
                formatValue(newValue));
    }

    private String formatValue(Object value) {
        if (value == null) return "null";
        if (value instanceof Instant) {
            return ((Instant) value).atZone(ZoneId.systemDefault()).toLocalDateTime().toString();
        }
        return value.toString();
    }
}

