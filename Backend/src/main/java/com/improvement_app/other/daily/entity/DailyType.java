package com.improvement_app.other.daily.entity;

public enum DailyType {
    SMOKING("Smoking"),
    EXERCISE("Exercise"),
    WAKE_UP("WakeUp"),
    BOOK("Book"),
    WORK("Work");

    private final String name;

    DailyType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
