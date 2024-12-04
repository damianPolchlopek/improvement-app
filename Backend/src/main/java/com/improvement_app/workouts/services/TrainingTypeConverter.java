package com.improvement_app.workouts.services;

import java.util.Map;

public class TrainingTypeConverter {
    private static final Map<String, String> trainingTypeMap = Map.of(
            "A1", "Siłowy#1-A1",
            "B1", "Siłowy#1-B1",
            "C1", "Hipertroficzny#1-C1",
            "D1", "Hipertroficzny#1-D1",
            "A", "Siłowy#1-A",
            "B", "Siłowy#1-B",
            "C", "Hipertroficzny#1-C",
            "D", "Hipertroficzny#1-D",
            "E", "Basen#1-E"
    );

    public static String convert(String type) {
        return trainingTypeMap.getOrDefault(type, "Siłowy#1-A");
    }
}
