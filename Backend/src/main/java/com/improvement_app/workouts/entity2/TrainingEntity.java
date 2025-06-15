package com.improvement_app.workouts.entity2;

import com.improvement_app.workouts.entity2.enums.ExercisePlace;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "training", schema = "workout")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"exercises"})
@ToString(exclude = {"exercises"})
public class TrainingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private ExercisePlace place;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "training", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ExerciseEntity> exercises = new ArrayList<>();

    public TrainingEntity(LocalDate localDate, String trainingName,
                          ExercisePlace fromString, List<ExerciseEntity> exerciseList) {
        this.date = localDate;
        this.name = trainingName;
        this.place = fromString;
        this.exercises = exerciseList;
        for (ExerciseEntity exercise : exercises) {
            exercise.setTraining(this);
        }
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
