package com.improvement_app.workouts.mappers;

import com.improvement_app.workouts.controllers.request.ExerciseRequest;
import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.ExerciseSetEntity;
import com.improvement_app.workouts.entity.TrainingEntity;
import com.improvement_app.workouts.entity.enums.ExerciseName;
import com.improvement_app.workouts.entity.enums.ExercisePlace;
import com.improvement_app.workouts.entity.enums.ExerciseProgress;
import com.improvement_app.workouts.entity.enums.ExerciseType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
public class TrainingEntityParser {

    /**
     * Główna metoda parsująca listę ExerciseRequest na TrainingEntity
     */
    public static TrainingEntity from(List<ExerciseRequest> exerciseRequests) {
        if (exerciseRequests == null || exerciseRequests.isEmpty()) {
            log.warn("Lista ExerciseRequest jest pusta lub null");
            return null;
        }

        // Sprawdzenie czy wszystkie ćwiczenia należą do jednego treningu
        Set<TrainingKey> uniqueTrainings = exerciseRequests.stream()
                .map(request -> new TrainingKey(request.getDate(), request.getTrainingName(), request.getPlace()))
                .collect(Collectors.toSet());

        if (uniqueTrainings.size() > 1) {
            log.error("Znaleziono {} różnych treningów w liście. Oczekiwano tylko jednego!", uniqueTrainings.size());
            throw new IllegalArgumentException("Lista zawiera ćwiczenia z różnych treningów. Oczekiwano tylko jednego treningu.");
        }

        TrainingKey trainingKey = uniqueTrainings.iterator().next();
        return createTrainingEntity(trainingKey, exerciseRequests);
    }

    private static TrainingEntity createTrainingEntity(TrainingKey trainingKey, List<ExerciseRequest> exerciseRequests) {
        // Grupowanie ćwiczeń po nazwie, typie i progressie
        Map<ExerciseKey, List<ExerciseRequest>> groupedExercises = exerciseRequests.stream()
                .collect(Collectors.groupingBy(request ->
                        new ExerciseKey(request.getName(), request.getType(), request.getProgress())
                ));

        List<ExerciseEntity> exerciseEntities = groupedExercises.entrySet().stream()
                .map(entry -> createExerciseEntity(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(exercise ->
                        exerciseRequests.stream()
                                .filter(req -> req.getName().equals(exercise.getName().name()))
                                .mapToInt(ExerciseRequest::getIndex)
                                .min()
                                .orElse(0)
                ))
                .collect(Collectors.toList());

        TrainingEntity trainingEntity = new TrainingEntity(
                trainingKey.getDate(),
                trainingKey.getTrainingName(),
                ExercisePlace.fromString(trainingKey.getPlace()),
                exerciseEntities
        );

        // Ustawienie relacji parent-child
        exerciseEntities.forEach(exercise -> exercise.setTraining(trainingEntity));

        return trainingEntity;
    }

    private static ExerciseEntity createExerciseEntity(ExerciseKey exerciseKey, List<ExerciseRequest> exerciseRequests) {
        Set<ExerciseSetEntity> exerciseSets = new LinkedHashSet<>();

        for (ExerciseRequest request : exerciseRequests) {
            Set<ExerciseSetEntity> sets = parseExerciseSets(request.getReps(), request.getWeight());
            exerciseSets.addAll(sets);
        }

        ExerciseEntity exerciseEntity = new ExerciseEntity(
                ExerciseName.fromValue(exerciseKey.getName()),
                ExerciseType.fromValue(exerciseKey.getType()),
                ExerciseProgress.fromValue(exerciseKey.getProgress()),
                exerciseSets
        );

        // Ustawienie relacji parent-child
        exerciseSets.forEach(set -> set.setExercise(exerciseEntity));

        return exerciseEntity;
    }

    /**
     * Parsuje stringi reps i weight na zestaw ExerciseSetEntity
     * Obsługuje formaty z ukośnikami: reps="12/10/8", weight="50/55/60" lub weight="50/50/50"
     */
    private static Set<ExerciseSetEntity> parseExerciseSets(String repsStr, String weightStr) {
        Set<ExerciseSetEntity> sets = new LinkedHashSet<>();

        if (repsStr == null || repsStr.trim().isEmpty()) {
            return sets;
        }

        try {
            // Parsowanie reps - zawsze z ukośnikami
            String[] repsArray = repsStr.split("/");

            // Parsowanie weight - z ukośnikami lub pojedyncza wartość
            String[] weightArray = null;
            if (weightStr != null && !weightStr.trim().isEmpty()) {
                if (weightStr.contains("/")) {
                    weightArray = weightStr.split("/");
                } else {
                    // Pojedyncza waga - powielamy dla wszystkich serii
                    Double singleWeight = parseWeight(weightStr);
                    weightArray = new String[repsArray.length];
                    String weightValue = singleWeight != null ? singleWeight.toString() : null;
                    Arrays.fill(weightArray, weightValue);
                }
            }

            // Tworzenie serii - każda pozycja to jedna seria
            for (int i = 0; i < repsArray.length; i++) {
                Double reps = parseDouble(repsArray[i].trim());
                Double weight = null;

                if (weightArray != null && i < weightArray.length && weightArray[i] != null) {
                    weight = parseWeight(weightArray[i].trim());
                }

                if (reps != null) {
                    sets.add(new ExerciseSetEntity(reps, weight));
                }
            }

        } catch (Exception e) {
            log.error("Błąd podczas parsowania reps: '{}', weight: '{}'", repsStr, weightStr, e);
        }

        return sets;
    }

    private static Double parseWeight(String weightStr) {
        if (weightStr == null || weightStr.trim().isEmpty()) {
            return null;
        }

        try {
            // Usunięcie jednostek (kg, lbs, itp.)
            String cleanWeight = weightStr.trim()
                    .replaceAll("(?i)(kg|lbs|lb)", "")
                    .trim();

            return parseDouble(cleanWeight);
        } catch (Exception e) {
            log.warn("Nie można sparsować wagi: '{}'", weightStr);
            return null;
        }
    }

    private static Double parseDouble(String str) {
        if (str == null || str.trim().isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(str.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static Integer parseInteger(String str) {
        if (str == null || str.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(str.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    // Klasy pomocnicze do grupowania
    private static class TrainingKey {
        private final LocalDate date;
        private final String trainingName;
        private final String place;

        public TrainingKey(LocalDate date, String trainingName, String place) {
            this.date = date;
            this.trainingName = trainingName != null ? trainingName : "Default Training";
            this.place = place != null ? place : "GYM";
        }

        public LocalDate getDate() { return date; }
        public String getTrainingName() { return trainingName; }
        public String getPlace() { return place; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            TrainingKey that = (TrainingKey) o;
            return Objects.equals(date, that.date) &&
                    Objects.equals(trainingName, that.trainingName) &&
                    Objects.equals(place, that.place);
        }

        @Override
        public int hashCode() {
            return Objects.hash(date, trainingName, place);
        }
    }

    private static class ExerciseKey {
        private final String name;
        private final String type;
        private final String progress;

        public ExerciseKey(String name, String type, String progress) {
            this.name = name != null ? name : "UNKNOWN";
            this.type = type != null ? type : "STRENGTH";
            this.progress = progress != null ? progress : "NORMAL";
        }

        public String getName() { return name; }
        public String getType() { return type; }
        public String getProgress() { return progress; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ExerciseKey that = (ExerciseKey) o;
            return Objects.equals(name, that.name) &&
                    Objects.equals(type, that.type) &&
                    Objects.equals(progress, that.progress);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, type, progress);
        }
    }
}
