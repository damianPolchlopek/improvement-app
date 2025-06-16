package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity2.ExerciseNameEntity;
import com.improvement_app.workouts.repository2.ExerciseNameEntityRepository;
import com.improvement_app.workouts.response.ExerciseNameResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class ExerciseNameService {

    private final ExerciseNameEntityRepository nameRepository;

    public List<ExerciseNameResponse> getExerciseNames() {
        return nameRepository.findAll()
                .stream()
                .map(ExerciseNameEntity::getName)
                .map(ExerciseNameResponse::new)
                .toList();
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
