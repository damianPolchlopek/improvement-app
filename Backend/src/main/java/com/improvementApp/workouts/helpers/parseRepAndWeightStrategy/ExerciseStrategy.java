package com.improvementApp.workouts.helpers.parseRepAndWeightStrategy;

import com.improvementApp.workouts.DTO.RepAndWeight;
import java.util.List;

public interface ExerciseStrategy {
    List<RepAndWeight> parseExercise();
}
