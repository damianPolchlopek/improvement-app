package com.improvement_app.workouts.entity2;

import com.improvement_app.workouts.entity2.enums.ExerciseName;
import com.improvement_app.workouts.entity2.enums.ExerciseProgress;
import com.improvement_app.workouts.entity2.enums.ExerciseType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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
}
