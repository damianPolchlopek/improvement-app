package com.improvement_app.workouts.services;

import java.util.HashMap;
import java.util.Map;

public class TrainingTypeConverter {

    private TrainingTypeConverter() {
        // Private constructor to prevent instantiation
    }

    private static final Map<String, String> trainingTypeMap = new HashMap<>();

    public static String convert(String type) {
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

        return trainingTypeMap.getOrDefault(type, "Siłowy#1-A");
    }
}
