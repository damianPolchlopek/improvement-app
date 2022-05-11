package com.improvementApp.workouts.services;

import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.entity.ExercisesFields.Name;
import com.improvementApp.workouts.entity.ExercisesFields.Place;
import com.improvementApp.workouts.entity.ExercisesFields.Progress;
import com.improvementApp.workouts.entity.ExercisesFields.Type;
import com.improvementApp.workouts.helpers.ExercisesHelper;
import com.improvementApp.workouts.repository.*;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final NameRepository nameRepository;
    private final PlaceRepository placeRepository;
    private final ProgressRepository progressRepository;
    private final TypeRepository typeRepository;

    public ExerciseServiceImpl(ExerciseRepository exerciseRepository, NameRepository nameRepository,
                               PlaceRepository placeRepository, ProgressRepository progressRepository,
                               TypeRepository typeRepository) {
        this.exerciseRepository = exerciseRepository;
        this.nameRepository = nameRepository;
        this.placeRepository = placeRepository;
        this.progressRepository = progressRepository;
        this.typeRepository = typeRepository;
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
        List<Exercise> exercises = exerciseRepository.findByName(name);
        ExercisesHelper.sortExerciseListByDate(exercises);
        return exercises;
    }

    @Override
    public List<Exercise> findByTrainingName(String trainingName) {
        LOGGER.info("Pobieram cwiczenia z treningu : " + trainingName);
        List<Exercise> exercises = exerciseRepository.findByTrainingName(trainingName);
        ExercisesHelper.sortExerciseListByIndex(exercises);
        return exercises;
    }

    @Override
    public void deleteByTrainingName(String trainingName) {
        exerciseRepository.deleteByTrainingName(trainingName);
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
        List<Exercise> exercises = exerciseRepository.findAll();
        ExercisesHelper.sortExerciseListByDate(exercises);
        return exercises;
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

    @Override
    public List<Name> getExerciseNames() {
        LOGGER.info("Pobieram wszystkie nazwy cwiczen");
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

    @Override
    public List<Place> getExercisePlaces() {
        LOGGER.info("Pobieram wszystkie miejsca cwiczen");
        return placeRepository.findAll();
    }

    @Override
    public List<Place> saveAllExercisePlaces(List<Place> placeList) {
        return placeRepository.saveAll(placeList);
    }

    @Override
    public void deleteAllExercisePlaces() {
        placeRepository.deleteAll();
    }

    @Override
    public List<Progress> getExerciseProgress() {
        LOGGER.info("Pobieram wszystkie progressy cwiczen");
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

    @Override
    public List<Type> getExerciseTypes() {
        LOGGER.info("Pobieram wszystkie typy cwiczen");
        List<Type> types = typeRepository.findAll();
        Collections.sort(types, Comparator.comparing(Type::getType).reversed());
        return types;
    }

    @Override
    public List<Type> saveAllExerciseTypes(List<Type> typeList) {
        return typeRepository.saveAll(typeList);
    }

    @Override
    public void deleteAllExerciseTypes() {
        typeRepository.deleteAll();
    }

    @Override
    public void deleteAllExercises() {
        exerciseRepository.deleteAll();
    }

}
