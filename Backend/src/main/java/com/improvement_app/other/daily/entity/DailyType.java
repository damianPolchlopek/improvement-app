package com.improvement_app.other.daily.entity;

public enum DailyType {
    HEALTH("Health"),
    EXERCISE("Exercise"),
    WAKE_UP("WakeUp"),
    BOOK("Book"),
    SOFTWARE("Software");

    private final String name;

    DailyType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
