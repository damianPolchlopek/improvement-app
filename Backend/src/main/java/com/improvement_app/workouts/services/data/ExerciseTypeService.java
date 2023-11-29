package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.exercisesfields.Type;
import com.improvement_app.workouts.repository.TypeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@AllArgsConstructor
public class ExerciseTypeService {

    private final TypeRepository typeRepository;

    public List<Type> getExerciseTypes() {
        List<Type> types = typeRepository.findAll();
        types.sort(Comparator.comparing(Type::getType).reversed());
        return types;
    }

    public List<Type> saveAllExerciseTypes(List<Type> typeList) {
        return typeRepository.saveAll(typeList);
    }

    public void deleteAllExerciseTypes() {
        typeRepository.deleteAll();
    }
}
