package com.improvement_app.workouts.converters;

import java.util.Map;

public class TrainingTypeConverter {

    private static final Map<String, String> EXERCISE_TYPE_BY_CODE = Map.ofEntries(
            Map.entry("A", "SILOWY_A"),
            Map.entry("B", "SILOWY_B"),
            Map.entry("C", "HIPERTROFICZNY_C"),
            Map.entry("D", "HIPERTROFICZNY_D"),
            Map.entry("E", "BASEN_E"),
            Map.entry("K1", "KETTLE_K1"),
            Map.entry("K2", "KETTLE_K2"),
            Map.entry("K3", "KETTLE_K3"),
            Map.entry("KARDIO", "KARDIO"),
            Map.entry("F", "FBW_F"),
            Map.entry("F1", "FBW_F_1"),
            Map.entry("F2", "FBW_F_2"),
            Map.entry("F3A", "FBW_3_A"),
            Map.entry("F3B", "FBW_3_B")
    );

    private static final Map<String, String> TEMPLATE_NAME_BY_CODE = Map.ofEntries(
            Map.entry("A", "Siłowy#1-A"),
            Map.entry("B", "Siłowy#1-B"),
            Map.entry("C", "Hipertroficzny#1-C"),
            Map.entry("D", "Hipertroficzny#1-D"),
            Map.entry("E", "Basen#1-E"),
            Map.entry("K1", "Kettle#1-K1"),
            Map.entry("K2", "Kettle#1-K2"),
            Map.entry("K3", "Kettle#1-K3"),
            Map.entry("KARDIO", "Kardio"),
            Map.entry("F", "FBW#2-F"),
            Map.entry("F1", "FBW#1-F1"),
            Map.entry("F2", "FBW#1-F2"),
            Map.entry("F3A", "FBW#3-A"),
            Map.entry("F3B", "FBW#3-B")
    );

    private TrainingTypeConverter() {
        // Private constructor to prevent instantiation
    }

    public static String toExerciseType(String type) {
        String exerciseType = EXERCISE_TYPE_BY_CODE.get(type);
        if (exerciseType == null) {
            throw new IllegalArgumentException("Nieznany typ treningu: " + type);
        }
        return exerciseType;
    }

    public static String toTrainingTemplate(String type) {
        String templateName = TEMPLATE_NAME_BY_CODE.get(type);
        if (templateName == null) {
            throw new IllegalArgumentException("Brak szablonu dla typu treningu: " + type);
        }
        return templateName;
    }

}
