package com.improvement_app.workouts.entity2;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercise_set", schema = "workout")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private ExerciseEntity exercise;

    private Double rep;

    private Double weight;

    public ExerciseSetEntity(Double rep, Double weight) {
        this.rep = rep;
        this.weight = weight;
    }

    public Double getCapacity(){
        return rep * weight;
    }
}
