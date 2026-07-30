package com.improvement_app.workouts.converters;

import java.util.Map;

public class TrainingTypeConverter {

    private static final Map<String, String> EXERCISE_TYPE_BY_CODE = Map.ofEntries(
            Map.entry("A1", "SILOWY_A1"),
            Map.entry("B1", "SILOWY_B1"),
            Map.entry("A2", "SILOWY_A2"),
            Map.entry("B2", "SILOWY_B2"),
            Map.entry("A", "SILOWY_A"),
            Map.entry("B", "SILOWY_B"),
            Map.entry("C", "HIPERTROFICZNY_C"),
            Map.entry("C1", "HIPERTROFICZNY_C1"),
            Map.entry("C2", "HIPERTROFICZNY_C2"),
            Map.entry("D", "HIPERTROFICZNY_D"),
            Map.entry("D1", "HIPERTROFICZNY_D1"),
            Map.entry("D2", "HIPERTROFICZNY_D2"),
            Map.entry("E", "BASEN_E"),
            Map.entry("K1", "KETTLE_K1"),
            Map.entry("K2", "KETTLE_K2"),
            Map.entry("K3", "KETTLE_K3"),
            Map.entry("KARDIO", "KARDIO"),
            Map.entry("F", "FBW_F"),
            Map.entry("F1", "FBW_F_1"),
            Map.entry("F2", "FBW_F_2")
    );

    private static final Map<String, String> TEMPLATE_NAME_BY_CODE = Map.ofEntries(
            Map.entry("A1", "Siłowy#1-A1"),
            Map.entry("B1", "Siłowy#1-B1"),
            Map.entry("C1", "Hipertroficzny#1-C1"),
            Map.entry("D1", "Hipertroficzny#1-D1"),
            Map.entry("A2", "Siłowy#1-A2"),
            Map.entry("B2", "Siłowy#1-B2"),
            Map.entry("C2", "Hipertroficzny#1-C2"),
            Map.entry("D2", "Hipertroficzny#1-D2"),
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
            Map.entry("F2", "FBW#1-F2")
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
