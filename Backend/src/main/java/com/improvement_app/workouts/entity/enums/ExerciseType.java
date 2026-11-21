package com.improvement_app.workouts.entity.enums;

public enum ExerciseType {
    KETTLE_K3("Kettle#1-K3"),
    BASEN_E("Basen#1-E"),
    SILOWY_B("Siłowy#1-B"),
    KETTLE_K2("Kettle#1-K2"),
    HIPERTROFICZNY_C("Hipertroficzny#1-C"),
    HIPERTROFICZNY_D("Hipertroficzny#1-D"),
    SILOWY_A("Siłowy#1-A"),
    KARDIO("Kardio"),
    ROWER("Rower#1-R"),
    FBW_F("FBW#2-F"),
    FBW_F_1("FBW#1-F1"),
    FBW_F_2("FBW#1-F2"),
    FBW_3_A("FBW#3-A"),
    FBW_3_B("FBW#3-B"),
    KETTLE_K1("Kettle#1-K1");

    private final String value;

    ExerciseType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ExerciseType fromValue(String value) {
        for (ExerciseType type : values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }

        throw new IllegalArgumentException("Unknown type: " + value);
    }
}

