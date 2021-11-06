package com.improvementApp.workouts.entity.DTO;

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
}
