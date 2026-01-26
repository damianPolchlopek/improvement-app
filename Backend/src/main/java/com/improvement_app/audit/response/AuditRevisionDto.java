package com.improvement_app.audit.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.RevisionType;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditRevisionDto<D> {
    private D data;  // DTO zamiast encji
    private Integer revisionNumber;
    private Instant timestamp;
    private String username;
    private String ipAddress;
    private RevisionType revisionType;  // "CREATE", "UPDATE", "DELETE"

    public LocalDateTime getLocalDateTime() {
        return timestamp.atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public static <D> AuditRevisionDto<D> from(
            D data,
            Integer revisionNumber,
            Instant timestamp,
            String username,
            String ipAddress,
            RevisionType revisionType) {

        return AuditRevisionDto.<D>builder()
                .data(data)
                .revisionNumber(revisionNumber)
                .timestamp(timestamp)
                .username(username)
                .ipAddress(ipAddress)
                .revisionType(revisionType)
                .build();
    }

}
