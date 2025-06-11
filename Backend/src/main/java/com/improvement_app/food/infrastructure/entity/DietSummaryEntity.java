package com.improvement_app.food.infrastructure.entity;

import com.improvement_app.security.entity.UserEntity;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "diet_summary")
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

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private List<EatenMealEntity> meals;

    public DietSummaryEntity(Long id, double kcal, double protein, double carbohydrates, double fat,
                             LocalDate date, List<EatenMealEntity> toEntity) {
        this.id = id;
        this.kcal = kcal;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
        this.fat = fat;
        this.date = date;
        this.meals = toEntity;
    }
}
