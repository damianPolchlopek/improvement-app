package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.exercisesfields.Progress;
import com.improvement_app.workouts.repository.ProgressRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExerciseProgressServiceImpl implements ExerciseProgressService {

    private final ProgressRepository progressRepository;

    @Override
    public List<Progress> getExerciseProgress() {
        return progressRepository.findAll();
    }

    @Override
    public List<Progress> saveAllExerciseProgresses(List<Progress> progressList) {
        return progressRepository.saveAll(progressList);
    }

    @Override
    public void deleteAllExerciseProgresses() {
        progressRepository.deleteAll();
    }

}
