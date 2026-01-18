package com.improvement_app.food.infrastructure.entity.summary;

import com.improvement_app.security.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
}
