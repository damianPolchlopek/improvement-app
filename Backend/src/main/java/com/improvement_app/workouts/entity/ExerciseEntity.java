package com.improvement_app.workouts.entity;

import com.improvement_app.workouts.request.ExerciseRequest;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.entity.enums.ExerciseProgress;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "exercise", schema = "workout")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"training", "exerciseSets"})
@ToString(exclude = {"training", "exerciseSets"})
public class ExerciseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_id", nullable = false)
    private TrainingEntity training;

    @Enumerated(EnumType.STRING)
    private ExerciseName name;

    @Enumerated(EnumType.STRING)
    private ExerciseType type;

    @Enumerated(EnumType.STRING)
    private ExerciseProgress progress;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("id")
    private List<ExerciseSetEntity> exerciseSets = new ArrayList<>();

    public ExerciseEntity(ExerciseName name, ExerciseType type, ExerciseProgress progress,
                          List<ExerciseSetEntity> exerciseSets) {
        this.name = name;
        this.type = type;
        this.progress = progress;
        this.exerciseSets = exerciseSets;
        for (ExerciseSetEntity exerciseSet : exerciseSets) {
            exerciseSet.setExercise(this);
        }
    }

    public ExerciseEntity(ExerciseName exerciseName) {
        this.name = exerciseName;
    }

    public static List<ExerciseEntity> create(List<ExerciseRequest> exerciseRequests) {
        List<ExerciseEntity> result = new ArrayList<>();

        for (ExerciseRequest request : exerciseRequests) {
            List<ExerciseSetEntity> sets = ExerciseSetEntity.fromString(request);
            ExerciseEntity exerciseEntity = new ExerciseEntity(
                    ExerciseName.fromValue(request.getName()),
                    ExerciseType.fromValue(request.getType()),
                    ExerciseProgress.fromValue(request.getProgress()),
                    sets
            );

            result.add(exerciseEntity);
        }

        return result;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExerciseEntity that = (ExerciseEntity) o;
        return name == that.name && type == that.type && progress == that.progress;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, type, progress);
    }
}