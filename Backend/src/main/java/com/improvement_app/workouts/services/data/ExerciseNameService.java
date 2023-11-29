package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.exercisesfields.Name;
import com.improvement_app.workouts.repository.NameRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExerciseNameService {

    private final NameRepository nameRepository;

    public List<Name> getExerciseNames() {
        return nameRepository.findAll();
    }

    public List<Name> saveAllExerciseNames(List<Name> nameList) {
        return nameRepository.saveAll(nameList);
    }

    public void deleteAllExerciseNames() {
        nameRepository.deleteAll();
    }
}
