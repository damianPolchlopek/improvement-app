package com.improvementApp.workouts.entity.DTO;

import java.util.Objects;

public class RepAndWeight {
    private Double repetition;
    private Double weight;

    public RepAndWeight(Double repetition, Double weight) {
        this.repetition = repetition;
        this.weight = weight;
    }

    public Double getRepetition() {
        return repetition;
    }

    public void setRepetition(Double repetition) {
        this.repetition = repetition;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    @Override
    public String toString() {
        return "RepAndWeight{" +
                "repetition=" + repetition +
                ", weight=" + weight +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RepAndWeight that = (RepAndWeight) o;
        return Objects.equals(repetition, that.repetition) &&
                Objects.equals(weight, that.weight);
    }

    @Override
    public int hashCode() {
        return Objects.hash(repetition, weight);
    }
}
