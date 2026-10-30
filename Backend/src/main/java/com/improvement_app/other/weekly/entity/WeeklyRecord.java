package com.improvement_app.other.weekly.entity;

import com.improvement_app.audit.basic.AuditableEntity;
import com.improvement_app.other.weekly.request.WeeklyRecordRequest;
import com.improvement_app.security.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "weekly_record", schema = "other")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = {"user"})
@ToString(exclude = {"user"})
public class WeeklyRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private LocalDate date;

    public static WeeklyRecord from(WeeklyRecordRequest request, UserEntity user) {
        WeeklyRecord weeklyRecord = new WeeklyRecord();
        weeklyRecord.user = user;
        weeklyRecord.name = request.name().trim();
        weeklyRecord.category = request.category();
        weeklyRecord.date = LocalDate.now();
        return weeklyRecord;
    }
}
