package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.exercisesfields.Name;
import com.improvement_app.workouts.repository.NameRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExerciseNameServiceImpl implements ExerciseNameService {
    private final NameRepository nameRepository;

    @Override
    public List<Name> getExerciseNames() {
        return nameRepository.findAll();
    }

    @Override
    public List<Name> saveAllExerciseNames(List<Name> nameList) {
        return nameRepository.saveAll(nameList);
    }

    @Override
    public void deleteAllExerciseNames() {
        nameRepository.deleteAll();
    }
}
