package com.improvement_app.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditChanges<T> {
    private T oldVersion;
    private T newVersion;
    private Integer oldRevision;
    private Integer newRevision;
    private Map<String, AuditFieldChange> changes;
    private boolean hasChanges;

    public static <T> AuditChanges<T> createOperation(T entity, Number revision) {
        return AuditChanges.<T>builder()
                .newVersion(entity)
                .newRevision(revision.intValue())
                .changes(new HashMap<>())
                .hasChanges(false)
                .build();
    }

    public int getChangedFieldsCount() {
        return changes != null ? changes.size() : 0;
    }

    public List<String> getChangedFieldNames() {
        return changes != null ? new ArrayList<>(changes.keySet()) : new ArrayList<>();
    }
}