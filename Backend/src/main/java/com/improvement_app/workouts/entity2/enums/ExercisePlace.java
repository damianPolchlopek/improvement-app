package com.improvement_app.workouts.entity2.enums;

public enum ExercisePlace {
    GYM("Siłownia"),
    HOME("Dom"),
    OUTDOORS("Plener"),
    OTHER("Inne");

    private final String value;

    ExercisePlace(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ExercisePlace fromString(String place) {
        for (ExercisePlace exercisePlace : ExercisePlace.values()) {
            if (exercisePlace.value.equalsIgnoreCase(place)) {
                return exercisePlace;
            }
        }
        return OTHER; // Domyślnie OTHER, jeśli brak dopasowania
    }
}
