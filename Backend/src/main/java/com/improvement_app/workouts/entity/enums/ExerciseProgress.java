package com.improvement_app.workouts.entity.enums;

public enum ExerciseProgress {
    NO_CHANGE("Zostawić"),
    INCREASE("Zwiększyć");

    private final String value;

    ExerciseProgress(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ExerciseProgress fromValue(String value) {
        for (ExerciseProgress progress : values()) {
            if (progress.value.equalsIgnoreCase(value)) {
                return progress;
            }
        }
        throw new IllegalArgumentException("Unknown progress: " + value);
    }
}
