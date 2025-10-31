package com.improvement_app.food.infrastructure.entity.summary;

import com.improvement_app.security.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "diet_summary_id")
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
    }
}
