package com.improvement_app.common.audit.envers;

import org.hibernate.envers.RevisionEntity;
import org.hibernate.envers.RevisionNumber;
import org.hibernate.envers.RevisionTimestamp;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "revinfo", schema = "audit")
@RevisionEntity(CustomRevisionListener.class)
@Data
public class CustomRevisionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @RevisionNumber
    private Integer rev;

    @RevisionTimestamp
    private Long revtstmp;

    @Column(name = "username", length = 100)
    private String username;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;
}