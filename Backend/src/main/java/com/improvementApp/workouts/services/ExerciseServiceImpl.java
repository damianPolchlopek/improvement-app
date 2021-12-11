package com.improvementApp.workouts.services;

import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.repository.ExerciseRepository;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public ExerciseServiceImpl(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    private static final Logger LOGGER = Logger.getLogger(ExerciseServiceImpl.class);

    @Override
    public List<Exercise> findByDate(LocalDate date) {
        LOGGER.info("Pobieram cwiczenia o dacie: " + date);
        return exerciseRepository.findByDate(date);
    }

    @Override
    public List<Exercise> findByName(String name) {
        LOGGER.info("Pobieram cwiczenia o nazwie: " + name);
        return exerciseRepository.findByName(name);
    }

    @Override
    public List<Exercise> findByTrainingName(String trainingName) {
        LOGGER.info("Pobieram cwiczenia z treningu : " + trainingName);
        return exerciseRepository.findByTrainingName(trainingName);
    }

    @Override
    public List<Exercise> saveAll(List<Exercise> exercises) {
        LOGGER.info("Zapisuje cwiczenia: " + exercises);
        return exerciseRepository.saveAll(exercises);
    }

    @Override
    public Exercise save(Exercise exercise) {
        LOGGER.info("Zapisuje cwiczenie: " + exercise);
        return exerciseRepository.save(exercise);
    }

    @Override
    public List<Exercise> findAll() {
        LOGGER.info("Pobieram wszystkie cwiczenia");
        return exerciseRepository.findAll();
    }

    @Override
    public void deleteById(String id) {
        LOGGER.info("Usuwam cwiczeni o id: " + id);
        exerciseRepository.deleteById(id);
    }

    @Override
    public List<String> getAllTrainingNames() {
        LOGGER.info("Pobieram nazwy wszystkich treningow");
        List<Exercise> exercises = exerciseRepository.findAll();

        return exercises.stream()
                    .map(Exercise::getTrainingName)
                    .distinct()
                    .collect(Collectors.toList());
    }
}
