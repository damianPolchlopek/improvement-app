package com.improvement_app.other.daily.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document
@NoArgsConstructor
public class Daily {
    @Id
    @Generated
    private String id;

    boolean smoking;
    boolean exercise;
    boolean book;
    boolean work;

    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate date;

    public Daily(Daily daily) {
        this.smoking = daily.isSmoking();
        this.exercise = daily.isExercise();
        this.book = daily.isBook();
        this.work = daily.isWork();
        this.date = LocalDate.now();
    }
}
