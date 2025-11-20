package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.ExerciseNameEntity;
import com.improvement_app.workouts.repository.ExerciseNameEntityRepository;
import com.improvement_app.workouts.response.ExerciseMetadataResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class ExerciseNameService {

    private final ExerciseNameEntityRepository nameRepository;

    @Transactional
    public List<ExerciseMetadataResponse> getExerciseNames() {
        return nameRepository.findAll()
                .stream()
                .map(ExerciseNameEntity::getName)
                .map(ExerciseMetadataResponse::new)
                .toList();
    }

    @Transactional
    public List<ExerciseNameEntity> saveAllExerciseNames(List<ExerciseNameEntity> nameList) {
        return nameRepository.saveAll(nameList);
    }

    @Transactional
    public void deleteAllExerciseNames() {
        nameRepository.deleteAll();
    }

    public void flush() {
        nameRepository.flush();
    }
}
