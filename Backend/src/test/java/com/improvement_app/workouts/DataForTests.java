package com.improvement_app.workouts;

import com.improvement_app.workouts.entity.Exercise;

import java.time.LocalDate;

public class DataForTests {
    final static String trainingType = "C";
    final static String trainingTypeStrength = "B";
    final static String exerciseType = "Hipertroficzny";
    final static String exerciseTypeStrength = "Siłowy";
    final static String exercisePlace = "Siłownia";

    final static String exerciseName1 = "exerciseName1";
    final static String exerciseName2 = "exerciseName2";
    final static String exerciseName3 = "exerciseName3";

    final static String exerciseProgress = "zostawic";
    final static String exerciseReps = "12/12/12/12";
    final static String exerciseWeight = "20/20/20/20";

    public static Exercise generateFirstExerciseFirstTraining(){
        int firstExerciseIndex = 101;
        String trainingDate = "11.11.2011";
        String trainingLocalDate = "2021-11-11";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        return new Exercise(exerciseType, exercisePlace, exerciseName1,
                null, exerciseProgress, LocalDate.parse(trainingLocalDate), exerciseReps, exerciseWeight,
                trainingName);
    }

    public static Exercise generateSecondExerciseFirstTraining(){
        int firstExerciseIndex = 101;
        String trainingDate = "11.11.2011";
        String trainingLocalDate = "2021-11-11";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        return new  Exercise(exerciseType, exercisePlace, exerciseName2,
                null, exerciseProgress, LocalDate.parse(trainingLocalDate), exerciseReps, exerciseWeight,
                trainingName);
    }

    public static Exercise generateThirdExerciseFirstTraining(){
        int firstExerciseIndex = 101;
        String trainingDate = "11.11.2011";
        String trainingLocalDate = "2021-11-11";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        return new Exercise(exerciseType, exercisePlace, exerciseName3,
                null, exerciseProgress, LocalDate.parse(trainingLocalDate), exerciseReps, exerciseWeight,
                trainingName);
    }

    public static Exercise generateFirstExerciseSecondTraining(){
        int firstExerciseIndex = 102;
        String trainingDate = "18.11.2011";
        String trainingLocalDate = "2021-11-18";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        return new Exercise(exerciseType, exercisePlace, exerciseName1,
                null, exerciseProgress, LocalDate.parse(trainingLocalDate), exerciseReps, exerciseWeight,
                trainingName);
    }

    public static Exercise generateSecondExerciseSecondTraining(){
        int firstExerciseIndex = 102;
        String trainingDate = "18.11.2011";
        String trainingLocalDate = "2021-11-18";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        return new Exercise(exerciseType, exercisePlace, exerciseName2,
                null, exerciseProgress, LocalDate.parse(trainingLocalDate), exerciseReps, exerciseWeight,
                trainingName);
    }

    public static Exercise generateThirdExerciseSecondTraining(){
        int firstExerciseIndex = 102;
        String trainingDate = "18.11.2011";
        String trainingLocalDate = "2021-11-18";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingType;

        return new Exercise(exerciseType, exercisePlace, exerciseName3,
                null, exerciseProgress, LocalDate.parse(trainingLocalDate), exerciseReps, exerciseWeight,
                trainingName);
    }

    public static Exercise generateFirstExerciseThirdTraining(){
        int firstExerciseIndex = 100;
        String trainingDate = "11.09.2011";
        String trainingLocalDate = "2021-09-11";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingTypeStrength;

        return new Exercise(exerciseTypeStrength, exercisePlace, exerciseName1,
                null, exerciseProgress, LocalDate.parse(trainingLocalDate), exerciseReps, exerciseWeight,
                trainingName);
    }

    public static Exercise generateSecondExerciseThirdTraining(){
        int firstExerciseIndex = 100;
        String trainingDate = "11.09.2011";
        String trainingLocalDate = "2021-09-11";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingTypeStrength;

        return new Exercise(exerciseTypeStrength, exercisePlace, exerciseName2,
                null, exerciseProgress, LocalDate.parse(trainingLocalDate), exerciseReps, exerciseWeight,
                trainingName);
    }

    public static Exercise generateThirdExerciseThirdTraining(){
        int firstExerciseIndex = 100;
        String trainingDate = "11.09.2011";
        String trainingLocalDate = "2021-09-11";
        String trainingName = firstExerciseIndex + " - " + trainingDate +"r. - " + trainingTypeStrength;

        return new Exercise(exerciseTypeStrength, exercisePlace, exerciseName3,
                null, exerciseProgress, LocalDate.parse(trainingLocalDate), exerciseReps, exerciseWeight,
                trainingName);
    }

}
