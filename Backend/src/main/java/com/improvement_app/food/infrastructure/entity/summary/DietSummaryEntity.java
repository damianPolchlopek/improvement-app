package com.improvement_app.food.infrastructure.entity.summary;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.improvement_app.security.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.hibernate.envers.RelationTargetAuditMode;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Audited
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "diet_summary", schema = "food")
@Builder
public class DietSummaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double kcal;
    private double protein;
    private double carbohydrates;
    private double fat;

    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @OneToMany(mappedBy = "dietSummary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DailyMealEntity> meals = new ArrayList<>();

    public DietSummaryEntity(Long id, double kcal, double protein, double carbohydrates, double fat,
                             LocalDate date, List<DailyMealEntity> toEntity) {
        this.id = id;
        this.kcal = kcal;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
        this.fat = fat;
        this.date = date;
        this.meals = toEntity;

        // Ustaw relację zwrotną
        if (toEntity != null) {
            for (DailyMealEntity meal : toEntity) {
                meal.setDietSummary(this);
            }
        }
    }

    @Override
    public String toString() {
        return "DietSummaryEntity{" +
                "id=" + id +
                ", kcal=" + kcal +
                ", protein=" + protein +
                ", carbohydrates=" + carbohydrates +
                ", fat=" + fat +
                ", date=" + date +
                ", user=" + user +
                ", meals=" + meals.stream().map(DailyMealEntity::getName).toList() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DietSummaryEntity that = (DietSummaryEntity) o;
        return Double.compare(that.kcal, kcal) == 0 && Double.compare(that.protein, protein) == 0 && Double.compare(that.carbohydrates, carbohydrates) == 0 && Double.compare(that.fat, fat) == 0 && id.equals(that.id) && date.equals(that.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, kcal, protein, carbohydrates, fat, date);
    }
}
