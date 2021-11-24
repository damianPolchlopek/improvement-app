package com.improvementApp.workouts.entity;

import java.util.*;

public class TrainingNameList {
    List<String> trainingNames = new ArrayList<>();

    public List<String> getTrainingNames() {
        return trainingNames;
    }

    public void setTrainingNames(List<String> trainingNames) {
        this.trainingNames = trainingNames;
    }

    public boolean add(String o) {
        return trainingNames.add((String) o);
    }

    public boolean remove(String o) {
        return trainingNames.remove(o);
    }

    public boolean addAll(Collection c) {
        return trainingNames.addAll(c);
    }

    public boolean addAll(int index, Collection c) {
        return trainingNames.addAll(index, c);
    }

    public int size() {
        return trainingNames.size();
    }

    public boolean isEmpty() {
        return trainingNames.isEmpty();
    }

    public boolean contains(String o) {
        return trainingNames.contains(o);
    }

    public void add(int index, String element) {
        trainingNames.add(index, element);
    }

    public Object remove(int index) {
        return trainingNames.remove(index);
    }

    public int indexOf(String o) {
        return trainingNames.indexOf(o);
    }

    public int lastIndexOf(String o) {
        return trainingNames.lastIndexOf(o);
    }

}
