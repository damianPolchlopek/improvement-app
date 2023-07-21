package com.improvement_app.other.weekly.entity;

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
public class WeeklyRecord {

    @Id
    @Generated
    private String id;
    private String name;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate date;
    private Category category;

}
