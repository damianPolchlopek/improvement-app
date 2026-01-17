package com.improvement_app.parser.entity;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "technology_list", schema = "technologies")
public class TechnologyList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    List<Technology> technologyList;

    public TechnologyList(List<Technology> technologies) {
        this.date = LocalDate.now();
        this.technologyList = technologies;
    }
}
