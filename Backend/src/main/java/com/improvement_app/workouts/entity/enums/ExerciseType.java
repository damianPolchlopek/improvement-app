package com.improvement_app.workouts.entity.enums;

public enum ExerciseType {
    HIPERTROFICZNY_C2("Hipertroficzny#1-C2"),
    KETTLE_K3("Kettle#1-K3"),
    BASEN_E("Basen#1-E"),
    SILOWY_B("Siłowy#1-B"),
    KETTLE_K2("Kettle#1-K2"),
    HIPERTROFICZNY_C("Hipertroficzny#1-C"),
    HIPERTROFICZNY_D("Hipertroficzny#1-D"),
    HIPERTROFICZNY_C1("Hipertroficzny#1-C1"),
    SILOWY_A("Siłowy#1-A"),
    SILOWY_A2("Siłowy#1-A2"),
    SILOWY_B2("Siłowy#1-B2"),
    SILOWY_A1("Siłowy#1-A1"),
    SILOWY_B1("Siłowy#1-B1"),
    HIPERTROFICZNY_D1("Hipertroficzny#1-D1"),
    KARDIO("Kardio"),
    ROWER("Rower#1-R"),
    HIPERTROFICZNY_D2("Hipertroficzny#1-D2"),
    FBW_F("FBW#2-F"),
    FBW_F_1("FBW#1-F1"),
    FBW_F_2("FBW#1-F2"),
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

