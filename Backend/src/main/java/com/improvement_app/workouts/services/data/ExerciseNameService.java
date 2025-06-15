package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity2.ExerciseNameEntity;
import com.improvement_app.workouts.repository2.ExerciseNameEntityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExerciseNameService {

    private final ExerciseNameEntityRepository nameRepository;

    public List<ExerciseNameEntity> getExerciseNames() {
        return nameRepository.findAll();
    }

    public List<ExerciseNameEntity> saveAllExerciseNames(List<ExerciseNameEntity> nameList) {
        return nameRepository.saveAll(nameList);
    }

    public void deleteAllExerciseNames() {
        nameRepository.deleteAll();
    }

    public void flush() {
        nameRepository.flush();
    }
}
