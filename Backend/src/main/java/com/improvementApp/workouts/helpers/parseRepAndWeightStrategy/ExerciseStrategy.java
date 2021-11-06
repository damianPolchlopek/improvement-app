package com.improvementApp.workouts.helpers.parseRepAndWeightStrategy;

import com.improvementApp.workouts.entity.DTO.RepAndWeight;
import java.util.List;

public interface ExerciseStrategy {
    List<RepAndWeight> parseExercise();
}
