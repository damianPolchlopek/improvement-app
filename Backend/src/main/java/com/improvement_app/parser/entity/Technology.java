package com.improvement_app.parser.entity;


import lombok.Data;

@Data
public class Technology {

    private String name;

    private int occurrences;

    @Override
    public String toString() {
        return "Technology{" +
                "name='" + name + '\'' +
                ", occurrences=" + occurrences +
                '}';
    }
}
