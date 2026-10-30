package com.improvement_app.other.daily.entity;

import com.improvement_app.audit.basic.AuditableEntity;
import com.improvement_app.other.daily.request.DailyRequest;
import com.improvement_app.security.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "daily", schema = "other")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = {"user"})
@ToString(exclude = {"user"})
public class Daily extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private LocalDate date;

    private boolean health;
    private boolean exercise;
    private boolean book;
    private boolean software;

    public static Daily from(DailyRequest request, UserEntity user) {
        Daily daily = new Daily();
        daily.user = user;
        daily.date = LocalDate.now();
        daily.health = request.health();
        daily.exercise = request.exercise();
        daily.book = request.book();
        daily.software = request.software();
        return daily;
    }
}
