package com.improvementApp.workouts.entity;

import lombok.Data;
import lombok.Generated;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document
public class TrainingSchema {

    @Id
    @Generated
    private String id;

    List<Exercise2> exercise2List;



}
