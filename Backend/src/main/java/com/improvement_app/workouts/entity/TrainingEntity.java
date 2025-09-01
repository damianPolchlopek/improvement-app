package com.improvement_app.workouts.entity;

import com.improvement_app.security.entity.UserEntity;
import com.improvement_app.workouts.entity.enums.ExercisePlace;
import com.improvement_app.workouts.request.ExerciseRequest;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

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

    public static TrainingEntity from(List<ExerciseRequest> trainingRequest) {

        List<ExerciseEntity> exercises = ExerciseEntity.create(trainingRequest);
        ExerciseRequest exerciseRequest = trainingRequest.get(0);

        return new TrainingEntity(
                LocalDate.now(),
                exerciseRequest.getTrainingName(),
                ExercisePlace.fromString(exerciseRequest.getPlace()),
                exercises
        );
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }


}
