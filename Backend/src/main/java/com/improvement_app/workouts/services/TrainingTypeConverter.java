package com.improvement_app.workouts.services;

import java.util.HashMap;
import java.util.Map;

public class TrainingTypeConverter {

    private TrainingTypeConverter() {
        // Private constructor to prevent instantiation
    }

    public static String toExerciseType(String type) {
        Map<String, String> trainingTypeMap = new HashMap<>();

        // Mapowanie kodów na nazwy enum-ów
        trainingTypeMap.put("A1", "SILOWY_A1");
        trainingTypeMap.put("B1", "SILOWY_B1");
        trainingTypeMap.put("A2", "SILOWY_A2");
        trainingTypeMap.put("B2", "SILOWY_B2");
        trainingTypeMap.put("A", "SILOWY_A");
        trainingTypeMap.put("B", "SILOWY_B");
        trainingTypeMap.put("C", "HIPERTROFICZNY_C");
        trainingTypeMap.put("C1", "HIPERTROFICZNY_C1");
        trainingTypeMap.put("C2", "HIPERTROFICZNY_C2");
        trainingTypeMap.put("D", "HIPERTROFICZNY_D");
        trainingTypeMap.put("D1", "HIPERTROFICZNY_D1");
        trainingTypeMap.put("D2", "HIPERTROFICZNY_D2");
        trainingTypeMap.put("E", "BASEN_E");
        trainingTypeMap.put("K1", "KETTLE_K1");
        trainingTypeMap.put("K2", "KETTLE_K2");
        trainingTypeMap.put("K3", "KETTLE_K3");
        trainingTypeMap.put("KARDIO", "KARDIO");
        trainingTypeMap.put("F", "FBW_F");

        return trainingTypeMap.getOrDefault(type, "SILOWY_A");
    }

    public static String toTrainingTemplate(String type) {
        final Map<String, String> trainingTypeMap = new HashMap<>();

        trainingTypeMap.put("A1", "Siłowy#1-A1");
        trainingTypeMap.put("B1", "Siłowy#1-B1");
        trainingTypeMap.put("C1", "Hipertroficzny#1-C1");
        trainingTypeMap.put("D1", "Hipertroficzny#1-D1");
        trainingTypeMap.put("D2", "Hipertroficzny#1-D2");
        trainingTypeMap.put("A", "Siłowy#1-A");
        trainingTypeMap.put("B", "Siłowy#1-B");
        trainingTypeMap.put("C", "Hipertroficzny#1-C");
        trainingTypeMap.put("D", "Hipertroficzny#1-D");
        trainingTypeMap.put("E", "Basen#1-E");
        trainingTypeMap.put("K1", "Kettle#1-K1");
        trainingTypeMap.put("K2", "Kettle#1-K2");
        trainingTypeMap.put("K3", "Kettle#1-K3");
        trainingTypeMap.put("F", "FBW#2-F");

        return trainingTypeMap.getOrDefault(type, "Siłowy#1-A");
    }


}
